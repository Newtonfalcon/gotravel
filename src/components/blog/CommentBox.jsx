"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function CommentBox({ blogId }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  async function submit(e) {
    e.preventDefault();
    if (!isSignedIn) return alert("Please sign in to comment.");
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed");
      setText("");
      router.refresh();
    } catch (e) {
      alert(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} required className="w-full p-2 border rounded" placeholder="Write a comment..." />
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-2 bg-amber-400 text-slate-900 rounded" disabled={loading}>{loading ? "Posting..." : "Post comment"}</button>
      </div>
    </form>
  );
}
