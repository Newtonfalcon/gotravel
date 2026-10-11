// src/components/blog/EngagementProvider.jsx
"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

/**
 * Shares like and comment counts between the action dock and the comment section.
 * Likes are optimistic; each request carries the desired state so it is idempotent,
 * and only the latest response is allowed to overwrite local state.
 */

const EngagementContext = createContext(null);

export function EngagementProvider({ postId, initialLikes, initialLiked, initialCommentCount, children }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [likeError, setLikeError] = useState("");
  const likedRef = useRef(initialLiked);
  const latestRequest = useRef(0);

  const toggleLike = useCallback(async () => {
    const next = !likedRef.current;
    const requestId = ++latestRequest.current;

    likedRef.current = next;
    setLiked(next);
    setLikes((count) => Math.max(0, count + (next ? 1 : -1)));
    setLikeError("");

    try {
      const response = await fetch(`/api/blogs/${postId}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: next }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Couldn't save your like.");

      if (requestId === latestRequest.current) {
        likedRef.current = data.liked;
        setLiked(data.liked);
        setLikes(data.likes);
      }
    } catch (error) {
      if (requestId === latestRequest.current) {
        likedRef.current = !next;
        setLiked(!next);
        setLikes((count) => Math.max(0, count + (next ? -1 : 1)));
        setLikeError(error.message || "Couldn't save your like.");
      }
    }
  }, [postId]);

  const value = useMemo(
    () => ({
      likes,
      liked,
      toggleLike,
      likeError,
      clearLikeError: () => setLikeError(""),
      commentCount,
      setCommentCount,
    }),
    [likes, liked, toggleLike, likeError, commentCount]
  );

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) throw new Error("useEngagement must be used inside <EngagementProvider>.");
  return context;
}