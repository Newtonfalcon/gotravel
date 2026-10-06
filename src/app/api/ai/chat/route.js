import { requireAuth } from "@/lib/auth";
import { ODARO_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import admin, { firestore } from "@/lib/firebaseAdmin";

// This API route proxies client messages to Google Gemini (server-side) and
// persists chats to Firestore with a 2-week expiry. It expects the following
// env vars: GEMINI_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

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

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: "Gemini key not configured", message: "The AI service is currently unavailable. Please try again later." }), { status: 500 });
    }

    const geminiModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const promptText = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

    let geminiRes;
    try {
      geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: ODARO_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: promptText }],
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Gemini request failed:", error);
      return new Response(JSON.stringify({ error: "Gemini request failed", message: "The AI service is temporarily unavailable. Please try again." }), { status: 502 });
    }

    if (!geminiRes.ok) {
      const txt = await geminiRes.text();
      return new Response(JSON.stringify({ error: "Gemini error", message: "The AI service failed to respond. Please try again in a moment.", detail: txt }), { status: 502 });
    }

    let geminiJson;
    try {
      geminiJson = await geminiRes.json();
    } catch (error) {
      console.error("Gemini response parsing failed:", error);
      return new Response(JSON.stringify({ error: "Invalid Gemini response", message: "The AI service returned an invalid response. Please try again." }), { status: 502 });
    }

    const assistantReply = geminiJson?.candidates
      ?.map((candidate) => candidate?.content?.parts?.map((part) => part?.text || "").join("") || "")
      .join("") || geminiJson?.output?.[0]?.content || "";

    if (!assistantReply) {
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
        assistantReply,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiryAt: expiry,
      });
    } catch (err) {
      console.error("Failed to save chat:", err);
    }

    return new Response(JSON.stringify({ reply: assistantReply }), { status: 200 });
  } catch (error) {
    console.error("Unexpected AI chat route error:", error);
    return new Response(JSON.stringify({ error: "Unexpected chat error", message: "Something went wrong while processing your message. Please try again." }), { status: 500 });
  }
}
