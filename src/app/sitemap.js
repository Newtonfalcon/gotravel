// src/app/sitemap.js
import { listPosts } from "@/lib/blog/store";

// Always generated on request so newly published posts appear immediately.
export const dynamic = "force-dynamic";

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://gotravelsltd.com").replace(/\/$/, "");

const STATIC_PAGES = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blogs", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap() {
  const pages = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency,
    priority,
  }));

  let posts = [];
  try {
    posts = await listPosts();
  } catch (error) {
    // A database hiccup must not break the sitemap; static pages still get served.
    console.error("[sitemap] could not load blog posts:", error?.message);
  }

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/blogs/${post.id}`,
    lastModified: post.updatedAt || post.publishedAt || undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...postEntries];
}