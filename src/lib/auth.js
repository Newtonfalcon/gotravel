/**
 * Auth helpers
 *
 * getUser() fetches the current user from MongoDB using the Clerk session ID.
 * It is memoised with React's cache() so it runs at most once per request,
 * no matter how many layouts or components call it.
 *
 * User document shape (set by the Clerk webhook):
 *   { clerkId, email, name, image, role: "user" | "admin", courses[], createdAt, updatedAt }
 *
 * To promote someone to admin, update their MongoDB doc:
 *   db.users.updateOne({ clerkId: "<id>" }, { $set: { role: "admin" } })
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import clientPromise from "@/lib/mongodb";

// ── Cached per-request user fetch ─────────────────────────────────────────────

/**
 * Returns the MongoDB user doc for the signed-in user, or null if signed out.
 * Cached with React cache() — runs once per request regardless of call count.
 */
export const getUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clientPromise;
  const user = await client
    .db("gotravel")
    .collection("users")
    .findOne(
      { clerkId: userId },
      { projection: { clerkId: 1, email: 1, name: 1, image: 1, role: 1, courses: 1 } }
    );

  if (!user) return null;

  // Serialise ObjectId so the result is safe to pass to Client Components
  return { ...user, _id: user._id.toString() };
});

// ── Guard helpers (call from layouts, server components, route handlers) ───────

/**
 * Ensures the user is signed in and exists in the DB.
 * Redirects to /sign-in if not.
 * Returns the user doc on success.
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  return user;
}

/**
 * Ensures the user is signed in AND has role "admin".
 * Redirects to /sign-in if not authenticated.
 * Redirects to /dashboard if authenticated but not admin.
 * Returns the user doc on success.
 */
export async function requireAdmin() {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}