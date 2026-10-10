import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";

// Simple admin guard placeholder. Replace with requireAdmin integration.
async function requireAdmin(req) {
  // If you have Clerk or other auth, validate here. For now allow if ENV set.
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return false;
  }
  return true;
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, body: content, image } = body;
  if (!title || !content) return NextResponse.json({ message: "missing" }, { status: 400 });

  try {
    const db = admin.firestore();
    const doc = await db.collection("blogs").add({
      title,
      body: content,
      image: image || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      likes: 0,
    });
    return NextResponse.json({ id: doc.id, ok: true });
  } catch (err) {
    return NextResponse.json({ message: err.message || String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = admin.firestore();
    const snap = await db.collection("blogs").orderBy("createdAt", "desc").limit(50).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ message: err.message || String(err) }, { status: 500 });
  }
}
