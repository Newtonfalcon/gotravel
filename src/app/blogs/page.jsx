// src/app/blogs/page.jsx
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BlogExplorer, { EmptyState } from "@/components/blog/BlogExplorer";
import { listPosts } from "@/lib/blog/store";

export const metadata = {
  title: "Blog",
  description:
    "Visa know-how, travel checklists and honest stories from Nigerians who have made the move abroad.",
  alternates: { canonical: "/blogs" },
};

export const dynamic = "force-dynamic";

async function loadPosts() {
  try {
    return { posts: await listPosts(), failed: false };
  } catch (error) {
    console.error("[blog] could not load posts:", error);
    return { posts: [], failed: true };
  }
}

export default async function BlogsPage() {
  const { posts, failed } = await loadPosts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <header className="relative isolate overflow-hidden bg-stone-950 text-white">
        <div className="pointer-events-none absolute -right-24 -top-40 -z-10 size-[30rem] rounded-full bg-amber-500/15 blur-3xl" />

        <svg
          aria-hidden="true"
          viewBox="0 0 640 320"
          className="pointer-events-none absolute right-0 top-20 -z-10 hidden w-[44rem] max-w-none md:block lg:right-8"
        >
          <path
            d="M10 290 C 130 70, 270 350, 370 170 S 560 30, 628 70"
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.55"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 12"
          />
          <circle cx="68" cy="214" r="7" fill="none" stroke="#fbbf24" strokeOpacity="0.7" strokeWidth="2" />
          <circle cx="370" cy="170" r="7" fill="none" stroke="#fbbf24" strokeOpacity="0.7" strokeWidth="2" />
          <g transform="translate(596 36) rotate(32) scale(1.9)" fill="none" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </g>
        </svg>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44 lg:px-8">
          <h1 className="max-w-3xl font-[family-name:var(--font-blog-display,system-ui,sans-serif)] text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Know the route before you go.
          </h1>
          <p className="mt-6 max-w-xl font-[family-name:var(--font-blog-reading,Georgia,serif)] text-lg leading-relaxed text-stone-300 sm:text-xl">
            Visa know-how, travel checklists and honest stories from Nigerians who have made the move.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {failed ? (
          <EmptyState
            title="We couldn't load the posts"
            text="Something went wrong on our side. Refresh the page in a moment."
          />
        ) : (
          <BlogExplorer posts={posts} />
        )}
      </main>

      <Footer />
    </div>
  );
}