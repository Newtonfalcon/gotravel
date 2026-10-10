import { NextResponse } from "next/server";
import admin from "../../../../../lib/firebaseAdmin";
import fetch from "node-fetch";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // allow admins only — implement real check in requireAdmin
  if (!process.env.IMGBB_API_KEY) return NextResponse.json({ message: "missing imgbb key" }, { status: 500 });
  const form = await req.formData();
  const file = form.get("image");
  if (!file) return NextResponse.json({ message: "no file" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ image: base64 }),
  });
  const j = await res.json();
  if (!res.ok) return NextResponse.json({ message: j?.error?.message || "imgbb error" }, { status: 500 });

  const url = j.data?.url;
  return NextResponse.json({ url, raw: j });
}
