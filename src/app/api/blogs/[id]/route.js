import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";

export async function GET(req, { params }) {
  const { id } = params;
  try {
    const db = admin.firestore();
    const doc = await db.collection("blogs").doc(id).get();
    if (!doc.exists) return NextResponse.json({ message: "not found" }, { status: 404 });
    const data = doc.data();
    // fetch recent comments
    const commentsSnap = await db.collection("blogs").doc(id).collection("comments").orderBy("createdAt", "asc").get();
    const comments = commentsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ id: doc.id, ...data, comments });
  } catch (err) {
    return NextResponse.json({ message: err.message || String(err) }, { status: 500 });
  }
}
