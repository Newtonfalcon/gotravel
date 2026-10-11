// src/app/blogs/not-found.jsx
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata = { title: "Post not found" };

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="bg-stone-950 px-4 pb-24 pt-40 text-white sm:pb-32 sm:pt-48">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-[family-name:var(--font-blog-display,system-ui,sans-serif)] text-4xl font-semibold tracking-tight sm:text-6xl">
            That post took a different route.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-300">
            It may have been moved, unpublished or never existed. Browse the latest guides instead.
          </p>
          <Link
            href="/blogs"
            className="mt-9 inline-flex h-12 items-center rounded-full bg-amber-400 px-7 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
          >
            Back to all posts
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}