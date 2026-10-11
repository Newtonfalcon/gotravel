// src/components/blog/BlogExplorer.jsx
"use client";

import { useMemo, useState } from "react";
import { Search, X, Compass } from "lucide-react";
import { clsx } from "clsx";
import BlogCard, { FeaturedCard } from "./BlogCard";

/** Client-side search and tag filter over the already-loaded list of published posts. */
export default function BlogExplorer({ posts }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  const tags = useMemo(() => {
    const counts = new Map();
    for (const post of posts) {
      for (const tag of post.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !post.tags.includes(activeTag)) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        post.excerpt.toLowerCase().includes(needle) ||
        post.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [posts, query, activeTag]);

  const isFiltering = Boolean(query.trim() || activeTag);
  const featured = !isFiltering ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  function reset() {
    setQuery("");
    setActiveTag(null);
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        text="We're writing our first guides. Check back soon."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guides and stories"
            aria-label="Search posts"
            className="h-12 w-full rounded-full border border-stone-200 bg-white pl-11 pr-11 text-[0.95rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {tags.length > 0 && (
          <div
            role="group"
            aria-label="Filter by topic"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 lg:justify-end"
          >
            <TagChip active={activeTag === null} onClick={() => setActiveTag(null)}>All</TagChip>
            {tags.map((tag) => (
              <TagChip key={tag} active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
                {tag}
              </TagChip>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-stone-500" aria-live="polite">
        {isFiltering
          ? `${filtered.length} ${filtered.length === 1 ? "post" : "posts"} found`
          : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nothing matches that search"
          text="Try a different word, or browse every post."
          action={<button type="button" onClick={reset} className="mt-6 rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800">Show all posts</button>}
        />
      ) : (
        <div className="mt-8 space-y-16">
          {featured && <FeaturedCard post={featured} />}
          {rest.length > 0 && (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TagChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
        active ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, text, action = null }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600">
        <Compass className="size-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">{text}</p>
      {action}
    </div>
  );
}