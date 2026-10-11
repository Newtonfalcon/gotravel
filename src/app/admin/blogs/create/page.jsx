// src/app/admin/blogs/create/page.jsx
import BlogEditor from "@/components/admin/blog/BlogEditor";
import { blogFontVariables } from "@/lib/blog/fonts";

export const metadata = { title: "New post — Admin" };

export default function AdminCreateBlogPage() {
  return (
    <div className={blogFontVariables}>
      <BlogEditor mode="create" />
    </div>
  );
}