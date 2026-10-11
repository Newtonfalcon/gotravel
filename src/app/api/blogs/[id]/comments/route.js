// src/app/api/blogs/[id]/comments/route.js
import { NextResponse } from "next/server";
import { addComment, getPost, listComments } from "@/lib/blog/store";
import { getCommenter, getViewer, isAdminUser } from "@/lib/blog/viewer";
import { badRequest, errorResponse, readJson, tooManyRequests } from "@/lib/blog/http";
import { commentSchema, firstIssue } from "@/lib/blog/validation";
import { rateLimit } from "@/lib/blog/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    if (!(await getPost(id))) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }
    const viewer = await getViewer();
    const isAdmin = await isAdminUser(viewer.userId);
    const items = await listComments(id, { userId: viewer.userId, isAdmin });
    return NextResponse.json({ items });
  } catch (error) {
    return errorResponse(error, "blog:comments:list");
  }
}

/** Commenting requires a signed-in user. */
export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const commenter = await getCommenter();
    if (!commenter) {
      return NextResponse.json({ message: "Sign in to leave a comment." }, { status: 401 });
    }

    const limit = rateLimit(`comment:${commenter.userId}`, { limit: 5, windowMs: 60_000 });
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const parsed = commentSchema.safeParse(await readJson(request));
    if (!parsed.success) return badRequest(firstIssue(parsed.error));

    const comment = await addComment(id, parsed.data.text, commenter);
    return NextResponse.json({ ok: true, id: comment.id, comment }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "blog:comments:create");
  }
}