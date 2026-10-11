// src/app/api/blogs/[id]/likes/route.js
import { NextResponse } from "next/server";
import { getLikeState, setLike } from "@/lib/blog/store";
import { getViewer } from "@/lib/blog/viewer";
import { badRequest, clientIp, errorResponse, readJson, tooManyRequests } from "@/lib/blog/http";
import { firstIssue, likeSchema } from "@/lib/blog/validation";
import { rateLimit } from "@/lib/blog/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Current like count and whether this viewer has liked the post. */
export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const viewer = await getViewer();
    const state = await getLikeState(id, viewer.likerKey);
    if (!state) return NextResponse.json({ message: "Post not found." }, { status: 404 });
    return NextResponse.json(state);
  } catch (error) {
    return errorResponse(error, "blog:likes:get");
  }
}

/**
 * Anyone can like — signed in or not. Body: { liked: boolean } sets the state
 * idempotently; an empty body toggles it. One like per user or visitor cookie.
 */
export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const limit = rateLimit(`like:${clientIp(request)}`, { limit: 40, windowMs: 60_000 });
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const parsed = likeSchema.safeParse((await readJson(request)) ?? {});
    if (!parsed.success) return badRequest(firstIssue(parsed.error));

    const viewer = await getViewer({ issueVisitorId: true });
    const result = await setLike(id, viewer.likerKey, parsed.data.liked);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return errorResponse(error, "blog:likes:set");
  }
}