import { requireAuth } from "@/lib/auth";
import { ODARO_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import admin, { firestore } from "@/lib/firebaseAdmin";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeMessageContent(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join("\n");
  }
  return String(content ?? "");
}

async function fetchGroqWithRetry({ groqKey, groqModel, messages }) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: groqModel,
          messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      const rawText = await response.text();

      if (!response.ok) {
        const isRetryable = [408, 429, 500, 502, 503, 504].includes(response.status);

        if (isRetryable && attempt < 3) {
          console.warn("Groq transient error, retrying...", {
            attempt,
            status: response.status,
            model: groqModel,
            response: rawText.slice(0, 500),
          });
          await sleep(attempt * 1000);
          continue;
        }

        return {
          ok: false,
          status: response.status,
          message: rawText,
        };
      }

      try {
        const data = JSON.parse(rawText);
        if (data?.error) {
          return {
            ok: false,
            status: 400,
            message: JSON.stringify(data.error),
          };
        }
        return { ok: true, data };
      } catch (error) {
        return {
          ok: true,
          data: rawText,
        };
      }
    } catch (error) {
      if (attempt < 3) {
        console.warn("Groq network error, retrying...", {
          attempt,
          error: error.message,
          model: groqModel,
        });
        await sleep(attempt * 1000);
        continue;
      }

      throw error;
    }
  }

  return {
    ok: false,
    status: 502,
    message: "Groq request failed after retries.",
  };
}

// This API route proxies client messages to Groq (server-side) and
// persists chats to Firestore with a 2-week expiry.

export async function POST(req) {
  try {
    const user = await requireAuth({ redirectOnFail: false });

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized", message: "Please sign in to use the AI assistant." }), { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid payload", message: "We could not read your message. Please try again." }), { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return new Response(JSON.stringify({ error: "Groq key not configured", message: "The AI service is currently unavailable. Please try again later." }), { status: 500 });
    }

    const groqModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
    const groqMessages = [
      { role: "system", content: ODARO_SYSTEM_PROMPT },
      ...messages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: normalizeMessageContent(message.content),
      })),
    ];

    let groqResult;
    try {
      groqResult = await fetchGroqWithRetry({ groqKey, groqModel, messages: groqMessages });
    } catch (error) {
      console.error("Groq request failed:", error);
      return new Response(JSON.stringify({ error: "Groq request failed", message: "The AI service is temporarily unavailable. Please try again." }), { status: 502 });
    }

    if (!groqResult.ok) {
      console.error("Groq API error:", {
        status: groqResult.status,
        model: groqModel,
        response: groqResult.message,
      });
      return new Response(JSON.stringify({
        error: "Groq error",
        message: "The AI service failed to respond. Please try again in a moment.",
        detail: groqResult.message,
        status: groqResult.status,
        model: groqModel,
      }), { status: 502 });
    }

    const groqJson = groqResult.data;
    const assistantReply =
      groqJson?.choices?.[0]?.message?.content ||
      groqJson?.output?.[0]?.content ||
      "";

    if (!assistantReply || !String(assistantReply).trim()) {
      return new Response(JSON.stringify({ error: "Empty AI response", message: "The AI service returned no reply. Please try again." }), { status: 502 });
    }

    try {
      const db = firestore();
      const now = new Date();
      const expiry = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      await db.collection("ai_chats").add({
        userId: user.clerkId,
        userName: user.name || null,
        userEmail: user.email || null,
        messages,
        assistantReply: String(assistantReply),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiryAt: expiry,
      });
    } catch (err) {
      console.error("Failed to save chat:", err);
    }

    return new Response(JSON.stringify({ reply: String(assistantReply) }), { status: 200 });
  } catch (error) {
    console.error("Unexpected AI chat route error:", error);
    return new Response(JSON.stringify({ error: "Unexpected chat error", message: "Something went wrong while processing your message. Please try again." }), { status: 500 });
  }
}
