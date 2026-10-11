// src/lib/blog/viewer.js
import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";

/**
 * Who is looking at the blog?
 *
 *  - Signed-in users are identified by their Clerk id.
 *  - Anonymous visitors get a random, httpOnly cookie so a browser can only like a post once.
 *
 * Likes are allowed for both. Comments require a signed-in user.
 */

export const VISITOR_COOKIE = "gt_vid";
const VISITOR_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Pass `issueVisitorId: true` only from Route Handlers — cookies cannot be set while
 * rendering a Server Component.
 */
export async function getViewer({ issueVisitorId = false } = {}) {
  const { userId } = await auth();
  if (userId) return { userId, likerKey: `u_${userId}` };

  const jar = await cookies();
  let visitorId = jar.get(VISITOR_COOKIE)?.value;
  if (visitorId && !VISITOR_ID.test(visitorId)) visitorId = undefined;

  if (!visitorId && issueVisitorId) {
    visitorId = crypto.randomUUID();
    jar.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ONE_YEAR,
    });
  }

  return { userId: null, likerKey: visitorId ? `v_${visitorId}` : null };
}

/** Admin role lives in MongoDB. A database hiccup must never break a public page. */
export async function isAdminUser(userId) {
  if (!userId) return false;
  try {
    const user = await getUser();
    return user?.role === "admin";
  } catch (error) {
    console.error("[blog] admin lookup failed:", error?.message);
    return false;
  }
}

/** Public display identity for a signed-in commenter (never includes the email). */
export async function getCommenter() {
  const user = await currentUser();
  if (!user) return null;

  const name =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Traveler";

  return { userId: user.id, name: name.slice(0, 80), image: user.imageUrl || null };
}