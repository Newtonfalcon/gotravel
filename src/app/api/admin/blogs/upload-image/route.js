// src/app/api/admin/blogs/upload-image/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadToImgbb, validateImage } from "@/lib/imgbb";
import { errorResponse, badRequest, tooManyRequests } from "@/lib/blog/http";
import { rateLimit } from "@/lib/blog/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only: uploads one image to imgbb and returns its public URL. */
export async function POST(request) {
  try {
    const admin = await requireAdmin({ redirectOnFail: false });
    if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

    const limit = rateLimit(`upload:${admin.clerkId}`, { limit: 20, windowMs: 60_000 });
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    let form;
    try {
      form = await request.formData();
    } catch {
      return badRequest("Upload the image as multipart form data.");
    }

    const file = form.get("image");
    validateImage(file);

    const image = await uploadToImgbb(file);
    return NextResponse.json({ ok: true, ...image });
  } catch (error) {
    return errorResponse(error, "blog:admin:upload");
  }
}