"use client";

import { useEffect, useState } from "react";

export default function AdminThumbnailsPage() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-white">Thumbnails</h1>

      <form onSubmit={upload} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <input placeholder="Name (required)" value={name} onChange={(e) => setName(e.target.value)} required className="px-3 py-2 border rounded bg-stone-800 text-white placeholder:text-stone-400" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="px-3 py-2 border rounded bg-stone-800 text-white" />
        <input placeholder="Or image URL" value={url} onChange={(e) => setUrl(e.target.value)} className="px-3 py-2 border rounded bg-stone-800 text-white placeholder:text-stone-400" />
        <div className="flex gap-2">
          <button disabled={loading} className="px-4 py-2 bg-amber-400 text-slate-900 rounded font-medium">{loading ? "Uploading..." : "Upload"}</button>
          <button type="button" onClick={() => { setName(""); setFile(null); setUrl(""); }} className="px-4 py-2 border rounded text-white">Clear</button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((t) => (
          <div key={t._id} className="border rounded-lg overflow-hidden bg-stone-800 shadow-sm">
            <div className="w-full h-44 bg-stone-700 flex items-center justify-center overflow-hidden">
              <img src={t.thumb || t.display_url || t.url} alt={t.name || "thumbnail"} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold text-white truncate">{t.name}</div>
              <div className="text-xs text-stone-300 line-clamp-2 mt-1 break-all">{t.url}</div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(t.url);
                      setCopiedId(t._id);
                      setTimeout(() => setCopiedId(null), 1500);
                    } catch (e) {
                      alert('Copy failed');
                    }
                  }}
                  className="px-2 py-1 border rounded text-xs text-white"
                >
                  {copiedId === t._id ? 'Copied' : 'Copy URL'}
                </button>

                <button onClick={() => remove(t._id, t.imgbbId)} className="px-2 py-1 border rounded text-xs text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
