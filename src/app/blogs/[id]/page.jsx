import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import CommentBox from "@/components/blog/CommentBox";

export default async function BlogPost({ params }) {
  const { id } = params;
  const res = await fetch(`/api/blogs/${id}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const post = await res.json();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/blogs" className="text-sm text-amber-400 mb-4 inline-block">← Back to blogs</Link>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      {post.image && <img src={post.image} alt={post.title} className="w-full rounded mb-4" />}
      <div className="prose max-w-none">
        <ReactMarkdown>{post.body || ""}</ReactMarkdown>
      </div>

      <div className="mt-6 flex gap-2">
        <form action={`/api/blogs/${id}/likes`} method="post">
          <button className="px-3 py-2 bg-amber-400 rounded text-slate-900">Like</button>
        </form>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        <div id="comments">
          {post.comments?.map((c) => (
            <div key={c.id} className="mb-2 p-3 border rounded bg-stone-800">
              <div className="text-sm text-stone-300">{c.user?.name || c.user?.clerkId}</div>
              <div className="mt-1 text-white">{c.text}</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <CommentBox blogId={id} />
        </div>
      </section>
    </div>
  );
}
