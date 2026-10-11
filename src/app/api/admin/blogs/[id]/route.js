// src/app/api/admin/blogs/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deletePost, getPost, updatePost } from "@/lib/blog/store";
import { badRequest, errorResponse, readJson } from "@/lib/blog/http";
import { firstIssue, updatePostSchema } from "@/lib/blog/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ message: "Unauthorized." }, { status: 401 });

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin({ redirectOnFail: false });
    if (!admin) return unauthorized();

    const post = await getPost(id, { scope: "admin" });
    if (!post) return NextResponse.json({ message: "Post not found." }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return errorResponse(error, "blog:admin:get");
  }
}

/** Partial update — also used to publish or unpublish with { status }. */
export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin({ redirectOnFail: false });
    if (!admin) return unauthorized();

    const parsed = updatePostSchema.safeParse(await readJson(request));
    if (!parsed.success) return badRequest(firstIssue(parsed.error));
    if (Object.keys(parsed.data).length === 0) return badRequest("Nothing to update.");

    const post = await updatePost(id, parsed.data);
    return NextResponse.json({ ok: true, post });
  } catch (error) {
    return errorResponse(error, "blog:admin:update");
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin({ redirectOnFail: false });
    if (!admin) return unauthorized();

    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "blog:admin:delete");
  }
}