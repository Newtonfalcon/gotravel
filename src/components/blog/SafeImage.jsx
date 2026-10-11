// src/components/blog/SafeImage.jsx
"use client";

import { useState } from "react";

/** <img> that swaps to a fallback node if the remote image cannot be loaded. */
export default function SafeImage({ src, alt = "", className, fallback = null, priority = false }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) return fallback;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  );
}