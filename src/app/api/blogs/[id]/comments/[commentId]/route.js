// src/app/api/blogs/[id]/comments/[commentId]/route.js
import { NextResponse } from "next/server";
import { deleteComment } from "@/lib/blog/store";
import { getViewer, isAdminUser } from "@/lib/blog/viewer";
import { errorResponse } from "@/lib/blog/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Authors can delete their own comments; admins can delete any comment. */
export async function DELETE(_request, { params }) {
  const { id, commentId } = await params;
  try {
    const viewer = await getViewer();
    if (!viewer.userId) {
      return NextResponse.json({ message: "Sign in to manage comments." }, { status: 401 });
    }
    const isAdmin = await isAdminUser(viewer.userId);
    await deleteComment(id, commentId, { userId: viewer.userId, isAdmin });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "blog:comments:delete");
  }
}