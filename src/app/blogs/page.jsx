import Link from "next/link";

export default async function BlogsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/blogs`, { cache: "no-store" });
  const j = await res.json();
  const items = j.items || [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((b) => (
          <Link key={b.id} href={`/blogs/${b.id}`} className="p-4 border rounded hover:shadow bg-stone-800">
            <div className="text-lg font-medium text-white">{b.title}</div>
            <div className="text-sm text-stone-300">{b.body?.slice?.(0, 160)}...</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
