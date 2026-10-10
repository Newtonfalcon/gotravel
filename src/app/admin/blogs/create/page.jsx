"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCreateBlog() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);
        const upl = await fetch("/api/admin/blogs/upload-image", { method: "POST", body: form });
        const j = await upl.json();
        if (!upl.ok) throw new Error(j?.message || "Upload failed");
        imageUrl = j.url;
      }

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, image: imageUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Create failed");
      router.push("/admin/blogs");
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-white">Create Blog</h1>
      <form onSubmit={submit} className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full px-3 py-2 border rounded bg-stone-800 text-white placeholder:text-stone-400" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Markdown body" rows={10} className="w-full px-3 py-2 border rounded bg-stone-800 text-white placeholder:text-stone-400" />
        <div>
          <input className="text-white" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>
        <div className="flex items-center gap-2">
          <button disabled={loading} className="px-4 py-2 bg-amber-400 text-slate-900 rounded">{loading ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
