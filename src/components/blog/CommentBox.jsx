// src/components/blog/CommentBox.jsx
"use client";

import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { LIMITS, initials } from "@/lib/blog/utils";

/** Composer for signed-in users. Calls onPosted(comment) with the saved comment. */
export default function CommentBox({ postId, user, onPosted }) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  const name = user?.fullName || user?.username || "You";
  const remaining = LIMITS.comment - text.length;
  const canSubmit = text.trim().length > 0 && remaining >= 0 && !pending;

  function autosize(element) {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 280)}px`;
  }

  async function submit(event) {
    event?.preventDefault();
    if (!canSubmit) return;

    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/blogs/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Your session expired. Sign in again to comment."
            : data.message || "Couldn't post your comment."
        );
      }
      setText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      onPosted(data.comment);
    } catch (err) {
      setError(err.message || "Couldn't post your comment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-3 sm:gap-4">
      {user?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.imageUrl} alt="" className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-400 text-sm font-bold text-stone-950" aria-hidden="true">
          {initials(name)}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <label htmlFor="comment-text" className="sr-only">Write a comment</label>
        <textarea
          id="comment-text"
          ref={textareaRef}
          value={text}
          rows={3}
          maxLength={LIMITS.comment + 200}
          placeholder="Share a tip, ask a question or add your experience"
          onChange={(event) => {
            setText(event.target.value);
            autosize(event.target);
          }}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit(event);
          }}
          className="block w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[0.95rem] leading-relaxed text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className={remaining < 0 ? "text-sm font-medium text-red-600" : "text-sm text-stone-400"}>
            {remaining <= 200 ? `${remaining} characters left` : "Be kind and keep it helpful"}
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
          >
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
            {pending ? "Posting" : "Post comment"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}