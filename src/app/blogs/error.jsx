// src/app/blogs/error.jsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function BlogError({ error, reset }) {
  useEffect(() => {
    console.error("[blog]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="bg-stone-950 px-4 pb-24 pt-40 text-white sm:pb-32 sm:pt-48">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-[family-name:var(--font-blog-display,system-ui,sans-serif)] text-4xl font-semibold tracking-tight sm:text-6xl">
            We couldn&apos;t load this page.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-300">
            Something went wrong on our side. Try again, or head back to the blog.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="h-12 rounded-full bg-amber-400 px-7 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
            >
              Try again
            </button>
            <Link
              href="/blogs"
              className="inline-flex h-12 items-center rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              All posts
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}