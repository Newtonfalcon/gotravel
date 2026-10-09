"use client";

import { useEffect, useState } from "react";

export default function AdminThumbnailsPage() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    const res = await fetch("/api/admin/thumbnails");
    if (!res.ok) return;
    const json = await res.json();
    setList(json.thumbnails || []);
  }

  async function upload(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      if (file) fd.append("image", file);
      if (url) fd.append("imageUrl", url);
      if (name) fd.append("name", name);

      const res = await fetch("/api/admin/thumbnails", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        setName("");
        setFile(null);
        setUrl("");
        fetchList();
      } else {
        alert(json.error || "Upload failed");
      }
    } catch (err) {
      alert(err.message || "Upload error");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id, imgbbId) {
    if (!confirm("Delete this thumbnail?")) return;
    const res = await fetch("/api/admin/thumbnails", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id: id, imgbbId }) });
    const json = await res.json();
    if (json.success) fetchList(); else alert(json.error || "Delete failed");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Thumbnails</h1>

      <form onSubmit={upload} className="mb-6 flex gap-3">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border rounded" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="px-3 py-2 border rounded" />
        <input placeholder="Or image URL" value={url} onChange={(e) => setUrl(e.target.value)} className="px-3 py-2 border rounded" />
        <button disabled={loading} className="px-4 py-2 bg-amber-400 rounded">{loading ? "Uploading..." : "Upload"}</button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {list.map((t) => (
          <div key={t._id} className="border p-3 rounded">
            <img src={t.thumb || t.display_url || t.url} alt={t.name || "thumbnail"} className="w-full h-36 object-cover mb-2" />
            <div className="text-sm font-medium">{t.name}</div>
            <div className="text-xs text-slate-600">{t.url}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => navigator.clipboard.writeText(t.url)} className="px-2 py-1 border rounded text-xs">Copy URL</button>
              <button onClick={() => remove(t._id, t.imgbbId)} className="px-2 py-1 border rounded text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
