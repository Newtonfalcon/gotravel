// src/app/blogs/layout.jsx
import { blogFontVariables } from "@/lib/blog/fonts";

export default function BlogsLayout({ children }) {
  return <div className={blogFontVariables}>{children}</div>;
}