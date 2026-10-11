// src/app/admin/blog/page.js
import { redirect } from "next/navigation";

// The blog dashboard lives at /admin/blogs. Keep old links working.
export default function LegacyAdminBlogPage() {
  redirect("/admin/blogs");
}