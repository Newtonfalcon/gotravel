import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import admin from "../../../../../lib/firebaseAdmin";

export async function GET(req, { params }) {
  const { id } = params;
  try {
    const db = admin.firestore();
    const snap = await db.collection("blogs").doc(id).collection("comments").orderBy("createdAt", "asc").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ message: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const user = await requireAuth({ redirectOnFail: false });
  if (!user) return NextResponse.json({ message: "unauthenticated" }, { status: 401 });
  const { id } = params;
  const body = await req.json();
  const { text } = body;
  if (!text) return NextResponse.json({ message: "missing" }, { status: 400 });
  try {
    const db = admin.firestore();
    const doc = await db.collection("blogs").doc(id).collection("comments").add({
      text,
      user: { clerkId: user.clerkId, name: user.name || null },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: doc.id, ok: true });
  } catch (err) {
    return NextResponse.json({ message: err.message || String(err) }, { status: 500 });
  }
}
