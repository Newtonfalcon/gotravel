// src/components/blog/PostDock.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, Link2, MessageCircle, Share2 } from "lucide-react";
import { clsx } from "clsx";
import { useEngagement } from "./EngagementProvider";

/**
 * Floating action bar pinned to the bottom of the viewport while the article is on screen.
 * Liking works for everyone; commenting is handled further down the page.
 */
export default function PostDock({ title }) {
  const { liked, likes, toggleLike, likeError, clearLikeError, commentCount } = useEngagement();
  const [notice, setNotice] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const message = likeError || notice;
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => {
      setNotice("");
      clearLikeError();
    }, 2600);
    return () => clearTimeout(timer);
  }, [message, clearLikeError]);

  const share = useCallback(async () => {
    const url = window.location.href.split("#")[0];
    if (canNativeShare) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Link copied");
    } catch {
      setNotice("Copy the link from your address bar");
    }
  }, [canNativeShare, title]);

  const buttonClass =
    "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

  return (
    <div className="pointer-events-none sticky bottom-5 z-30 mt-14 flex flex-col items-center gap-2">
      <div aria-live="polite" className="min-h-8">
        {message && (
          <p className="pointer-events-auto rounded-full bg-stone-800 px-3.5 py-1.5 text-sm text-white shadow-lg ring-1 ring-white/10">
            {message}
          </p>
        )}
      </div>

      <div className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-stone-950/95 p-1.5 text-white shadow-[0_16px_40px_-10px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this post" : "Like this post"}
          className={clsx(buttonClass, "active:scale-95", liked && "text-rose-300")}
        >
          <Heart className={clsx("size-[18px] transition-transform", liked && "scale-110 fill-rose-400 text-rose-400")} aria-hidden="true" />
          <span className="tabular-nums">{likes}</span>
        </button>

        <a href="#comments" className={buttonClass} aria-label={`Jump to ${commentCount} comments`}>
          <MessageCircle className="size-[18px]" aria-hidden="true" />
          <span className="tabular-nums">{commentCount}</span>
        </a>

        <button type="button" onClick={share} className={buttonClass} aria-label="Share this post">
          {canNativeShare ? <Share2 className="size-[18px]" aria-hidden="true" /> : <Link2 className="size-[18px]" aria-hidden="true" />}
          <span className="hidden sm:inline">{canNativeShare ? "Share" : "Copy link"}</span>
        </button>
      </div>
    </div>
  );
}