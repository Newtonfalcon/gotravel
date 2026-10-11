// src/app/api/blogs/[id]/route.js
import { NextResponse } from "next/server";
import { getPost, listComments } from "@/lib/blog/store";
import { getViewer, isAdminUser } from "@/lib/blog/viewer";
import { errorResponse } from "@/lib/blog/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A published post together with its comments. */
export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const post = await getPost(id);
    if (!post) return NextResponse.json({ message: "Post not found." }, { status: 404 });

    const viewer = await getViewer();
    const isAdmin = await isAdminUser(viewer.userId);
    const comments = await listComments(id, { userId: viewer.userId, isAdmin });

    return NextResponse.json({ ...post, comments });
  } catch (error) {
    return errorResponse(error, "blog:get");
  }
}