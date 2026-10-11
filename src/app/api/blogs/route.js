// src/app/api/blogs/route.js
import { NextResponse } from "next/server";
import { listPosts } from "@/lib/blog/store";
import { errorResponse } from "@/lib/blog/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public list of published posts, newest first. */
export async function GET() {
  try {
    const items = await listPosts();
    return NextResponse.json({ items });
  } catch (error) {
    return errorResponse(error, "blog:list");
  }
}