// src/app/api/admin/blogs/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createPost, listPosts } from "@/lib/blog/store";
import { badRequest, errorResponse, readJson } from "@/lib/blog/http";
import { createPostSchema, firstIssue } from "@/lib/blog/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ message: "Unauthorized." }, { status: 401 });

/** All posts including drafts. */
export async function GET() {
  try {
    const admin = await requireAdmin({ redirectOnFail: false });
    if (!admin) return unauthorized();
    return NextResponse.json({ items: await listPosts({ scope: "admin" }) });
  } catch (error) {
    return errorResponse(error, "blog:admin:list");
  }
}

export async function POST(request) {
  try {
    const admin = await requireAdmin({ redirectOnFail: false });
    if (!admin) return unauthorized();

    const parsed = createPostSchema.safeParse(await readJson(request));
    if (!parsed.success) return badRequest(firstIssue(parsed.error));

    const id = await createPost(parsed.data, {
      clerkId: admin.clerkId,
      name: admin.name,
      image: admin.image,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "blog:admin:create");
  }
}