import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";

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
