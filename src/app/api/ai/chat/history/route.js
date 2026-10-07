import { requireAuth } from "@/lib/auth";
import admin, { firestore } from "@/lib/firebaseAdmin";

export async function GET(req) {
  try {
    const user = await requireAuth({ redirectOnFail: false });
    if (!user) return new Response(JSON.stringify({ messages: [] }), { status: 200 });

    try {
      const db = firestore();
      const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const snap = await db
        .collection("ai_chats")
        .where("userId", "==", user.clerkId)
        .where("createdAt", ">", cutoff)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      const messages = [];
      snap.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.messages)) {
          messages.push(...data.messages.slice(-10));
        } else if (data.assistantReply) {
          messages.push({ role: "assistant", content: data.assistantReply });
        }
      });

      // return most recent messages in chronological order
      const recent = messages.slice(-50);
      return new Response(JSON.stringify({ messages: recent }), { status: 200 });
    } catch (e) {
      return new Response(JSON.stringify({ messages: [] }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ messages: [] }), { status: 200 });
  }
}
