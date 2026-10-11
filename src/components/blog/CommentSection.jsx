// src/components/blog/CommentSection.jsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Loader2, MessageCircle, Trash2 } from "lucide-react";
import CommentBox from "./CommentBox";
import { useEngagement } from "./EngagementProvider";
import { initials, timeAgo } from "@/lib/blog/utils";

const PAGE_SIZE = 20;

export default function CommentSection({ postId, initialComments, initialSignedIn }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const signedIn = isLoaded ? isSignedIn : initialSignedIn;
  const pathname = usePathname();
  const { setCommentCount } = useEngagement();

  const [comments, setComments] = useState(initialComments);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  function handlePosted(comment) {
    setComments((current) => [comment, ...current]);
    setCommentCount((count) => count + 1);
  }

  async function handleDelete(comment) {
    setDeletingId(comment.id);
    setDeleteError("");
    try {
      const response = await fetch(`/api/blogs/${postId}/comments/${comment.id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Couldn't delete that comment.");
      }
      setComments((current) => current.filter((item) => item.id !== comment.id));
      setCommentCount((count) => Math.max(0, count - 1));
    } catch (error) {
      setDeleteError(error.message || "Couldn't delete that comment.");
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  }

  const shown = comments.slice(0, visible);

  return (
    <section id="comments" aria-labelledby="comments-heading" className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <h2
          id="comments-heading"
          className="font-[family-name:var(--font-blog-display,system-ui,sans-serif)] text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl"
        >
          Comments
        </h2>
        <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-stone-700">
          {comments.length}
        </span>
      </div>

      <div className="mt-8">
        {signedIn ? (
          <CommentBox postId={postId} user={user} onPosted={handlePosted} />
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-stone-950">Join the conversation</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-stone-600">
                  Sign in to comment. You can like this post without an account.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <SignInButton mode="modal" forceRedirectUrl={`${pathname}#comments`}>
                    <button type="button" className="h-10 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl={`${pathname}#comments`}>
                    <button type="button" className="h-10 rounded-full border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-800 transition hover:border-stone-900">
                      Create an account
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteError && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {deleteError}
        </p>
      )}

      {comments.length === 0 ? (
        <p className="mt-10 text-center text-[0.95rem] text-stone-500">
          No comments yet. Be the first to add one.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-stone-200/80">
          {shown.map((comment) => (
            <li key={comment.id} className="flex gap-3 py-6 first:pt-0 sm:gap-4">
              {comment.author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={comment.author.image} alt="" loading="lazy" className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
              ) : (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-200 text-sm font-bold text-stone-700" aria-hidden="true">
                  {initials(comment.author.name)}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-semibold text-stone-950">{comment.author.name}</span>
                  <time dateTime={comment.createdAt || undefined} suppressHydrationWarning className="text-sm text-stone-400">
                    {timeAgo(comment.createdAt)}
                  </time>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap break-words text-[0.97rem] leading-relaxed text-stone-700">
                  {comment.text}
                </p>

                {comment.canDelete && (
                  <div className="mt-2.5 flex items-center gap-2 text-sm">
                    {confirmingId === comment.id ? (
                      <>
                        <span className="text-stone-500">Delete this comment?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(comment)}
                          disabled={deletingId === comment.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                          {deletingId === comment.id && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
                          Delete
                        </button>
                        <button type="button" onClick={() => setConfirmingId(null)} className="rounded-full px-3 py-1 font-medium text-stone-600 transition hover:bg-stone-100">
                          Keep
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(comment.id)}
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {comments.length > visible && (
        <button
          type="button"
          onClick={() => setVisible((count) => count + PAGE_SIZE)}
          className="mx-auto mt-4 block rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-900"
        >
          Show more comments
        </button>
      )}
    </section>
  );
}