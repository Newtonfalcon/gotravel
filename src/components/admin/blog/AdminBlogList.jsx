// src/components/admin/blog/AdminBlogList.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ExternalLink, FileText, Heart, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { formatDate } from "@/lib/blog/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Drafts" },
];

export default function AdminBlogList({ initialPosts }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      draft: posts.filter((post) => post.status === "draft").length,
    }),
    [posts]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (filter !== "all" && post.status !== filter) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        post.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [posts, filter, query]);

  async function toggleStatus(post) {
    const next = post.status === "published" ? "draft" : "published";
    setBusyId(post.id);
    try {
      const response = await fetch(`/api/admin/blogs/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Couldn't update the post.");

      const updated = { ...data.post };
      delete updated.body;
      setPosts((current) => current.map((item) => (item.id === post.id ? updated : item)));
      setToast({ type: "success", message: next === "published" ? "Post published" : "Post moved to drafts" });
      router.refresh();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    const post = pendingDelete;
    if (!post) return;
    setBusyId(post.id);
    try {
      const response = await fetch(`/api/admin/blogs/${post.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Couldn't delete the post.");

      setPosts((current) => current.filter((item) => item.id !== post.id));
      setToast({ type: "success", message: "Post deleted" });
      router.refresh();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-stone-700 bg-stone-900/50 px-6 py-20 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-amber-400/10 text-amber-400">
          <FileText className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-stone-100">Write your first post</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-400">
          Posts appear on the public blog as soon as you publish them. Save drafts while you work.
        </p>
        <Link
          href="/admin/blogs/create"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
        >
          <Plus className="size-4" aria-hidden="true" />
          New post
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter posts" className="inline-flex w-fit rounded-xl border border-stone-800 bg-stone-900 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={clsx(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === item.id ? "bg-stone-800 text-amber-300" : "text-stone-400 hover:text-stone-200"
              )}
            >
              {item.label}
              <span className="ml-2 text-xs tabular-nums text-stone-500">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or tag"
            aria-label="Search posts"
            className="h-10 w-full rounded-xl border border-stone-800 bg-stone-900 pl-10 pr-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-stone-800 bg-stone-900 px-6 py-12 text-center text-sm text-stone-400">
          No posts match your filters.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-stone-800 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900">
          {visible.map((post) => {
            const busy = busyId === post.id;
            const published = post.status === "published";
            return (
              <li key={post.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                <Link
                  href={`/admin/blogs/${post.id}/edit`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-stone-800 sm:w-32"
                >
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <span className="grid size-full place-items-center text-stone-600">
                      <FileText className="size-6" />
                    </span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/blogs/${post.id}/edit`}
                      className="truncate text-base font-semibold text-stone-100 transition-colors hover:text-amber-300"
                    >
                      {post.title}
                    </Link>
                    <span
                      className={clsx(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        published
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-stone-600/40 bg-stone-700/40 text-stone-300"
                      )}
                    >
                      {published ? "Published" : "Draft"}
                    </span>
                  </div>

                  {post.excerpt && <p className="mt-1 line-clamp-1 text-sm text-stone-400">{post.excerpt}</p>}

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                    <span>{published ? `Published ${formatDate(post.publishedAt)}` : `Created ${formatDate(post.createdAt)}`}</span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="size-3" aria-hidden="true" />
                      {post.likes}
                      <span className="sr-only">likes</span>
                    </span>
                    <span>{post.readingTime} min read</span>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-md bg-stone-800 px-1.5 py-0.5 text-stone-400">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {published && (
                    <IconLink href={`/blogs/${post.id}`} label="View on site" external>
                      <ExternalLink className="size-4" />
                    </IconLink>
                  )}
                  <IconLink href={`/admin/blogs/${post.id}/edit`} label="Edit post">
                    <Pencil className="size-4" />
                  </IconLink>
                  <IconButton
                    label={published ? "Unpublish post" : "Publish post"}
                    onClick={() => toggleStatus(post)}
                    disabled={busy}
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </IconButton>
                  <IconButton label="Delete post" onClick={() => setPendingDelete(post)} disabled={busy} danger>
                    <Trash2 className="size-4" />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pendingDelete && (
        <DeleteDialog
          post={pendingDelete}
          busy={busyId === pendingDelete.id}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      <div aria-live="polite" className="pointer-events-none fixed bottom-6 right-6 z-50">
        {toast && (
          <p
            className={clsx(
              "pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl",
              toast.type === "error"
                ? "border-red-500/30 bg-red-950 text-red-200"
                : "border-emerald-400/30 bg-stone-900 text-emerald-300"
            )}
          >
            {toast.message}
          </p>
        )}
      </div>
    </div>
  );
}

const iconButtonClass =
  "grid size-9 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50";

function IconLink({ href, label, external = false, children }) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={iconButtonClass}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}

function IconButton({ label, onClick, disabled, danger = false, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={clsx(iconButtonClass, danger && "hover:bg-red-500/10 hover:text-red-400")}
    >
      {children}
    </button>
  );
}

function DeleteDialog({ post, busy, onCancel, onConfirm }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={busy ? undefined : onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-post-title"
        className="relative w-full max-w-md rounded-2xl border border-stone-700 bg-stone-900 p-6 shadow-2xl"
      >
        <h2 id="delete-post-title" className="text-lg font-semibold text-stone-100">Delete this post?</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-400">
          <span className="font-medium text-stone-200">{post.title}</span> will be removed along with its comments and likes. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-10 rounded-xl border border-stone-700 px-4 text-sm font-semibold text-stone-200 transition hover:bg-stone-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Delete post
          </button>
        </div>
      </div>
    </div>
  );
}