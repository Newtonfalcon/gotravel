// src/components/blog/BlogCard.jsx
import Link from "next/link";
import { ArrowUpRight, Clock, Heart } from "lucide-react";
import SafeImage from "./SafeImage";
import CoverFallback from "./CoverFallback";
import { formatDate } from "@/lib/blog/utils";

const DISPLAY = "font-[family-name:var(--font-blog-display,system-ui,sans-serif)]";
const READING = "font-[family-name:var(--font-blog-reading,Georgia,serif)]";

function Meta({ post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
      <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden="true" />
        {post.readingTime} min read
      </span>
      {post.likes > 0 && (
        <span className="inline-flex items-center gap-1.5">
          <Heart className="size-3.5" aria-hidden="true" />
          {post.likes}
          <span className="sr-only">{post.likes === 1 ? "like" : "likes"}</span>
        </span>
      )}
    </div>
  );
}

function Cover({ post, className }) {
  return (
    <SafeImage
      src={post.image}
      alt=""
      className={className}
      fallback={<CoverFallback seed={post.id} />}
    />
  );
}

/** Standard card used in the grid. The whole card is one link (stretched title link). */
export default function BlogCard({ post }) {
  return (
    <article className="group relative flex flex-col rounded-2xl has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-amber-500">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-black/5">
        <Cover
          post={post}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-2.5">
        {post.tags[0] && <p className="text-sm font-medium text-amber-700">{post.tags[0]}</p>}

        <h3 className={`${DISPLAY} text-xl font-semibold leading-snug tracking-tight text-stone-950 text-balance`}>
          <Link href={`/blogs/${post.id}`} className="outline-none after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className={`${READING} line-clamp-3 text-[0.97rem] leading-relaxed text-stone-600`}>{post.excerpt}</p>
        )}

        <div className="mt-auto pt-2">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}

/** Large editorial layout for the newest post. */
export function FeaturedCard({ post }) {
  return (
    <article className="group relative grid gap-8 rounded-3xl has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-8 has-[a:focus-visible]:outline-amber-500 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-stone-100 ring-1 ring-black/5 lg:col-span-7">
        <Cover
          post={post}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-col gap-5 lg:col-span-5">
        <p className="w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">Newest post</p>

        <h2 className={`${DISPLAY} text-3xl font-semibold leading-[1.1] tracking-tight text-stone-950 text-balance sm:text-4xl`}>
          <Link href={`/blogs/${post.id}`} className="outline-none after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className={`${READING} line-clamp-4 text-lg leading-relaxed text-stone-600`}>{post.excerpt}</p>
        )}

        <Meta post={post} />

        <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-stone-950 py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors group-hover:bg-amber-500 group-hover:text-stone-950">
          Read the post
          <span className="grid size-7 place-items-center rounded-full bg-white/15 group-hover:bg-stone-950/10">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </span>
      </div>
    </article>
  );
}