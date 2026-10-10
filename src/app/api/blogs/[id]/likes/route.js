import { NextResponse } from "next/server";
import admin from "../../../../../lib/firebaseAdmin";

export async function POST(req, { params }) {
  const { id } = params;
  try {
    const db = admin.firestore();
    const ref = db.collection("blogs").doc(id);
    await db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) throw new Error("not found");
      const data = doc.data();
      const next = (data.likes || 0) + 1;
      tx.update(ref, { likes: next });
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ message: err.message || String(err) }, { status: 500 });
  }
}
