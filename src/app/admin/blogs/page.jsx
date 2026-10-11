// src/app/admin/blogs/page.jsx
import Link from "next/link";
import { FileText, Globe, Heart, PencilLine, Plus } from "lucide-react";
import AdminBlogList from "@/components/admin/blog/AdminBlogList";
import { listPosts } from "@/lib/blog/store";

export const metadata = { title: "Blog posts — Admin" };
export const dynamic = "force-dynamic";

function Stat({ label, value, icon: Icon, accent }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-stone-800 bg-stone-900 p-5">
      <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${accent}`}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none tabular-nums text-stone-100">{value}</p>
        <p className="mt-1 text-xs font-semibold text-stone-400">{label}</p>
      </div>
    </div>
  );
}

export default async function AdminBlogsPage() {
  let posts = [];
  let failed = false;
  try {
    posts = await listPosts({ scope: "admin" });
  } catch (error) {
    console.error("[blog] admin list failed:", error);
    failed = true;
  }

  const published = posts.filter((post) => post.status === "published").length;
  const likes = posts.reduce((total, post) => total + post.likes, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-50 sm:text-3xl">Blog</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-400">
            Write and publish posts. Anyone can like a post; signed-in readers can also comment.
          </p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
        >
          <Plus className="size-4" aria-hidden="true" />
          New post
        </Link>
      </div>

      {failed ? (
        <div role="alert" className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/40 p-6">
          <p className="font-semibold text-red-200">Couldn&apos;t load your posts</p>
          <p className="mt-1 text-sm text-red-300/80">
            Check the Firebase environment variables and reload the page.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Total posts" value={posts.length} icon={FileText} accent="bg-amber-400/10 text-amber-400" />
            <Stat label="Published" value={published} icon={Globe} accent="bg-emerald-400/10 text-emerald-400" />
            <Stat label="Drafts" value={posts.length - published} icon={PencilLine} accent="bg-stone-700/50 text-stone-300" />
            <Stat label="Total likes" value={likes.toLocaleString("en-US")} icon={Heart} accent="bg-rose-400/10 text-rose-400" />
          </div>
          <AdminBlogList initialPosts={posts} />
        </>
      )}
    </div>
  );
}