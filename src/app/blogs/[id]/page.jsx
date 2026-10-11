// src/app/blogs/[id]/page.jsx
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Markdown from "@/components/blog/Markdown";
import BlogCard from "@/components/blog/BlogCard";
import SafeImage from "@/components/blog/SafeImage";
import CoverFallback from "@/components/blog/CoverFallback";
import PostDock from "@/components/blog/PostDock";
import CommentSection from "@/components/blog/CommentSection";
import { EngagementProvider } from "@/components/blog/EngagementProvider";
import { getPost, hasLiked, listComments, listPosts } from "@/lib/blog/store";
import { getViewer, isAdminUser } from "@/lib/blog/viewer";
import { formatDate, initials } from "@/lib/blog/utils";

export const dynamic = "force-dynamic";

// One Firestore read shared by generateMetadata and the page.
const loadPost = cache((id) => getPost(id));

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const post = await loadPost(id);
    if (!post) return { title: "Post not found" };

    const images = post.image ? [{ url: post.image }] : undefined;
    return {
      title: post.title,
      description: post.excerpt,
      alternates: { canonical: `/blogs/${id}` },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt,
        url: `/blogs/${id}`,
        publishedTime: post.publishedAt || undefined,
        modifiedTime: post.updatedAt || undefined,
        authors: [post.author.name],
        images,
      },
      twitter: {
        card: post.image ? "summary_large_image" : "summary",
        title: post.title,
        description: post.excerpt,
        images: post.image ? [post.image] : undefined,
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

const quiet = (fallback) => (error) => {
  console.error("[blog] optional data failed to load:", error?.message);
  return fallback;
};

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await loadPost(id);
  if (!post) notFound();

  const viewer = await getViewer();
  const isAdmin = await isAdminUser(viewer.userId);

  const [comments, liked, more] = await Promise.all([
    listComments(id, { userId: viewer.userId, isAdmin }).catch(quiet([])),
    hasLiked(id, viewer.likerKey).catch(quiet(false)),
    listPosts()
      .then((all) => all.filter((item) => item.id !== id).slice(0, 3))
      .catch(quiet([])),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: { "@type": "Person", name: post.author.name },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <header className="relative isolate overflow-hidden bg-stone-950 text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 -z-10 size-[28rem] rounded-full bg-amber-500/10 blur-3xl" />

        <div className={`mx-auto max-w-4xl px-4 pt-32 sm:px-6 sm:pt-40 ${post.image ? "pb-32 sm:pb-44" : "pb-14 sm:pb-20"}`}>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-stone-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All posts
          </Link>

          {post.tags.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <li key={tag} className="rounded-full border border-white/15 px-3 py-1 text-sm text-amber-300">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <h1 className={`${post.tags.length > 0 ? "mt-5" : "mt-8"} font-[family-name:var(--font-blog-display,system-ui,sans-serif)] text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl`}>
            {post.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-300">
            <div className="flex items-center gap-3">
              {post.author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.author.image} alt="" className="size-9 rounded-full object-cover ring-1 ring-white/20" />
              ) : (
                <span className="grid size-9 place-items-center rounded-full bg-amber-400 text-xs font-bold text-stone-950" aria-hidden="true">
                  {initials(post.author.name)}
                </span>
              )}
              <span className="font-medium text-white">{post.author.name}</span>
            </div>
            <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </header>

      {post.image && (
        <div className="relative z-10 mx-auto -mt-24 max-w-5xl px-4 sm:-mt-36 sm:px-6">
          <div className="aspect-[16/9] overflow-hidden rounded-3xl bg-stone-200 shadow-2xl shadow-stone-950/25 ring-1 ring-black/10">
            <SafeImage
              src={post.image}
              alt={post.title}
              priority
              className="size-full object-cover"
              fallback={<CoverFallback seed={post.id} />}
            />
          </div>
        </div>
      )}

      <EngagementProvider
        postId={id}
        initialLikes={post.likes}
        initialLiked={liked}
        initialCommentCount={comments.length}
      >
        <main>
          <article className="mx-auto max-w-[44rem] px-5 pb-20 pt-12 sm:px-6 sm:pt-16">
            <Markdown source={post.body} />
            <PostDock title={post.title} />
          </article>

          <section className="border-t border-stone-200/70 bg-stone-50 py-16 sm:py-20">
            <div className="mx-auto max-w-[44rem] px-5 sm:px-6">
              <CommentSection postId={id} initialComments={comments} initialSignedIn={Boolean(viewer.userId)} />
            </div>
          </section>
        </main>
      </EngagementProvider>

      {more.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="font-[family-name:var(--font-blog-display,system-ui,sans-serif)] text-3xl font-semibold tracking-tight text-stone-950">
            Keep reading
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <BlogCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}