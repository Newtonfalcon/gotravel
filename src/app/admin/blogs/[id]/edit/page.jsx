// src/app/admin/blogs/[id]/edit/page.jsx
import { notFound } from "next/navigation";
import BlogEditor from "@/components/admin/blog/BlogEditor";
import { getPost } from "@/lib/blog/store";
import { blogFontVariables } from "@/lib/blog/fonts";

export const metadata = { title: "Edit post — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminEditBlogPage({ params }) {
  const { id } = await params;
  const post = await getPost(id, { scope: "admin" });
  if (!post) notFound();

  return (
    <div className={blogFontVariables}>
      <BlogEditor mode="edit" initialPost={post} />
    </div>
  );
}