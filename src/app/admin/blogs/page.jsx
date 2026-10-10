import Link from "next/link";

export default async function AdminBlogsPage() {
  // Fetch list server-side
  let items = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/blogs`, { cache: "no-store" });
    if (res.ok) {
      const j = await res.json();
      items = j.items || [];
    }
  } catch (e) {
    console.warn(e);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <Link href="/admin/blogs/create" className="px-3 py-2 bg-amber-400 rounded text-slate-900">Create</Link>
      </div>

      <div className="space-y-3">
        {items.map((b) => (
          <div key={b.id} className="p-4 border rounded bg-stone-800">
            <div className="text-lg font-medium text-white">{b.title}</div>
            <div className="text-sm text-stone-300">{b.image ? "Has image" : "No image"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
