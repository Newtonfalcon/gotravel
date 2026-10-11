// src/lib/blog/validation.js
import { z } from "zod";
import { LIMITS } from "./utils";

const httpsUrl = z
  .string()
  .trim()
  .max(2048, "Image URL is too long")
  .refine((value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Image must be a valid https URL");

const fields = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(LIMITS.title, `Title must be ${LIMITS.title} characters or fewer`),
  body: z.string().max(LIMITS.body, "This post is too long"),
  excerpt: z
    .string()
    .trim()
    .max(LIMITS.excerpt, `Summary must be ${LIMITS.excerpt} characters or fewer`),
  image: z.union([httpsUrl, z.literal(""), z.null()]),
  tags: z.array(z.string()).max(LIMITS.tags, `Use at most ${LIMITS.tags} tags`),
  status: z.enum(["draft", "published"]),
});

/** Only the title is mandatory on create; everything else has a default in the store. */
export const createPostSchema = fields.partial({
  body: true,
  excerpt: true,
  image: true,
  tags: true,
  status: true,
});

export const updatePostSchema = fields.partial();

export const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Write a comment first")
    .max(LIMITS.comment, `Comments are limited to ${LIMITS.comment.toLocaleString("en-US")} characters`),
});

export const likeSchema = z.object({
  liked: z.boolean().optional(),
});

export function firstIssue(error) {
  return error?.issues?.[0]?.message || "Invalid request";
}