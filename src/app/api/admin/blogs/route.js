import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  const user = await requireAdmin({ redirectOnFail: false });
  if (!user) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, body: content, image } = body;
  if (!title || !content) return NextResponse.json({ message: "missing" }, { status: 400 });

  try {
    const db = admin.firestore();
    const docRef = await db.collection("blogs").add({
      title,
      body: content,
      image: image || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      author: { clerkId: user.clerkId, name: user.name || null },
    });
    return NextResponse.json({ id: docRef.id, ok: true });
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
