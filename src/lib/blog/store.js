// src/lib/blog/store.js
import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { firestore } from "@/lib/firebaseAdmin";
import { makeExcerpt, normalizeTags, readingTime } from "./utils";

/**
 * Firestore data layer for the blog.
 *
 *   blogs/{postId}                      title, body, excerpt, image, tags, status, likes,
 *                                       createdAt, updatedAt, publishedAt, author
 *   blogs/{postId}/comments/{commentId} text, user{clerkId,name,image}, createdAt
 *   blogs/{postId}/likes/{likerKey}     createdAt   (one doc per signed-in user / anonymous visitor)
 *
 * Documents written before `status`, `tags`, `excerpt` and `publishedAt` existed are
 * treated as published posts, so nothing in production needs migrating.
 */

const POSTS = "blogs";
const LIST_LIMIT = 100;
const COMMENT_LIMIT = 100;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export class BlogError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "BlogError";
    this.status = status;
  }
}

const db = () => firestore();
const postRef = (id) => db().collection(POSTS).doc(id);
const validId = (id) => typeof id === "string" && ID_PATTERN.test(id);

// ── Mapping ──────────────────────────────────────────────────────────────────

function toIso(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && typeof value._seconds === "number") {
    return new Date(value._seconds * 1000).toISOString();
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
}

function mapPost(snapshot, { withBody = false, rawExcerpt = false } = {}) {
  const data = snapshot.data();
  const body = typeof data.body === "string" ? data.body : "";
  const createdAt = toIso(data.createdAt);
  const customExcerpt = typeof data.excerpt === "string" ? data.excerpt.trim() : "";

  const post = {
    id: snapshot.id,
    title: data.title || "Untitled",
    excerpt: rawExcerpt ? customExcerpt : customExcerpt || makeExcerpt(body),
    image: typeof data.image === "string" && data.image ? data.image : null,
    tags: normalizeTags(data.tags),
    status: data.status === "draft" ? "draft" : "published",
    likes: Math.max(0, Number(data.likes) || 0),
    readingTime: readingTime(body),
    createdAt,
    publishedAt: toIso(data.publishedAt) || createdAt,
    updatedAt: toIso(data.updatedAt),
    author: {
      name: data.author?.name || "GoTravel Team",
      image: data.author?.image || null,
    },
  };

  return withBody ? { ...post, body } : post;
}

function mapComment(snapshot, viewer) {
  const data = snapshot.data();
  const ownerId = data.user?.clerkId || null;
  return {
    id: snapshot.id,
    text: typeof data.text === "string" ? data.text : "",
    createdAt: toIso(data.createdAt),
    author: {
      name: data.user?.name || "Traveler",
      image: data.user?.image || null,
    },
    canDelete: Boolean(viewer?.isAdmin || (viewer?.userId && ownerId === viewer.userId)),
  };
}

// ── Posts ────────────────────────────────────────────────────────────────────

/** scope "public" hides drafts. scope "admin" returns everything. */
export async function listPosts({ scope = "public" } = {}) {
  const snapshot = await db()
    .collection(POSTS)
    .orderBy("createdAt", "desc")
    .limit(LIST_LIMIT)
    .get();

  const posts = snapshot.docs.map((doc) => mapPost(doc, { rawExcerpt: scope === "admin" }));
  if (scope !== "admin") {
    return posts
      .filter((post) => post.status === "published")
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }
  return posts;
}

export async function getPost(id, { scope = "public" } = {}) {
  if (!validId(id)) return null;
  const snapshot = await postRef(id).get();
  if (!snapshot.exists) return null;

  const post = mapPost(snapshot, { withBody: true, rawExcerpt: scope === "admin" });
  if (scope !== "admin" && post.status !== "published") return null;
  return post;
}

export async function createPost(input, author) {
  const status = input.status === "draft" ? "draft" : "published";
  const body = (input.body ?? "").trim();

  if (status === "published" && !body) {
    throw new BlogError("Add some content before publishing.", 400);
  }

  const now = Timestamp.now();
  const ref = await db()
    .collection(POSTS)
    .add({
      title: input.title.trim(),
      body,
      excerpt: (input.excerpt ?? "").trim(),
      image: input.image || null,
      tags: normalizeTags(input.tags),
      status,
      likes: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: status === "published" ? now : null,
      author: {
        clerkId: author.clerkId,
        name: author.name || null,
        image: author.image || null,
      },
    });

  return ref.id;
}

export async function updatePost(id, patch) {
  if (!validId(id)) throw new BlogError("Post not found.", 404);

  const ref = postRef(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new BlogError("Post not found.", 404);

  const current = snapshot.data();
  const wasPublished = current.status !== "draft";
  const now = Timestamp.now();
  const update = { updatedAt: now };

  if (patch.title !== undefined) update.title = patch.title.trim();
  if (patch.body !== undefined) update.body = patch.body.trim();
  if (patch.excerpt !== undefined) update.excerpt = patch.excerpt.trim();
  if (patch.image !== undefined) update.image = patch.image || null;
  if (patch.tags !== undefined) update.tags = normalizeTags(patch.tags);
  if (patch.status !== undefined) update.status = patch.status;

  const nextStatus = update.status ?? (wasPublished ? "published" : "draft");
  const nextBody = update.body ?? (typeof current.body === "string" ? current.body : "");

  if (nextStatus === "published" && !nextBody.trim()) {
    throw new BlogError("Add some content before publishing.", 400);
  }
  if (nextStatus === "published" && !wasPublished && !current.publishedAt) {
    update.publishedAt = now;
  }

  await ref.update(update);
  return getPost(id, { scope: "admin" });
}

export async function deletePost(id) {
  if (!validId(id)) throw new BlogError("Post not found.", 404);
  const ref = postRef(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new BlogError("Post not found.", 404);
  // Removes the post together with its comments and likes sub-collections.
  await db().recursiveDelete(ref);
}

// ── Comments ─────────────────────────────────────────────────────────────────

/** viewer: { userId, isAdmin } — used to flag which comments the viewer may delete. */
export async function listComments(postId, viewer, { limit = COMMENT_LIMIT } = {}) {
  if (!validId(postId)) return [];
  const snapshot = await postRef(postId)
    .collection("comments")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snapshot.docs.map((doc) => mapComment(doc, viewer));
}

export async function addComment(postId, text, user) {
  if (!validId(postId)) throw new BlogError("Post not found.", 404);

  const parent = await postRef(postId).get();
  if (!parent.exists || parent.get("status") === "draft") {
    throw new BlogError("Post not found.", 404);
  }

  const ref = await postRef(postId)
    .collection("comments")
    .add({
      text,
      user: {
        clerkId: user.userId,
        name: user.name,
        image: user.image || null,
      },
      createdAt: Timestamp.now(),
    });

  return mapComment(await ref.get(), { userId: user.userId });
}

export async function deleteComment(postId, commentId, viewer) {
  if (!validId(postId) || !validId(commentId)) throw new BlogError("Comment not found.", 404);

  const ref = postRef(postId).collection("comments").doc(commentId);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new BlogError("Comment not found.", 404);

  const isOwner = viewer.userId && snapshot.get("user.clerkId") === viewer.userId;
  if (!isOwner && !viewer.isAdmin) {
    throw new BlogError("You can only delete your own comments.", 403);
  }
  await ref.delete();
}

// ── Likes ────────────────────────────────────────────────────────────────────

/** Whether this liker already liked the post (no post read needed). */
export async function hasLiked(postId, likerKey) {
  if (!validId(postId) || !likerKey) return false;
  return (await postRef(postId).collection("likes").doc(likerKey).get()).exists;
}

/** Returns { likes, liked } or null when the post does not exist / is a draft. */
export async function getLikeState(postId, likerKey) {
  if (!validId(postId)) return null;
  const snapshot = await postRef(postId).get();
  if (!snapshot.exists || snapshot.get("status") === "draft") return null;

  const liked = await hasLiked(postId, likerKey);
  return { likes: Math.max(0, Number(snapshot.get("likes")) || 0), liked };
}

/**
 * Idempotently sets whether `likerKey` likes the post. When `desired` is omitted the
 * current state is toggled. The counter and the per-liker document change atomically.
 */
export async function setLike(postId, likerKey, desired) {
  if (!validId(postId) || !likerKey) throw new BlogError("Post not found.", 404);

  const ref = postRef(postId);
  const likeRef = ref.collection("likes").doc(likerKey);

  return db().runTransaction(async (tx) => {
    const [post, like] = await Promise.all([tx.get(ref), tx.get(likeRef)]);
    if (!post.exists || post.get("status") === "draft") {
      throw new BlogError("Post not found.", 404);
    }

    const current = Math.max(0, Number(post.get("likes")) || 0);
    const wantLiked = desired === undefined ? !like.exists : desired;

    if (wantLiked && !like.exists) {
      tx.set(likeRef, { createdAt: FieldValue.serverTimestamp() });
      tx.update(ref, { likes: current + 1 });
      return { liked: true, likes: current + 1 };
    }
    if (!wantLiked && like.exists) {
      tx.delete(likeRef);
      tx.update(ref, { likes: Math.max(0, current - 1) });
      return { liked: false, likes: Math.max(0, current - 1) };
    }
    return { liked: like.exists, likes: current };
  });
}