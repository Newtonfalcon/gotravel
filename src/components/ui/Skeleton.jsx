"use client";

import { clsx } from "clsx";

// ── Core pulse animation (injected once) ──────────────────────────────────────
const PULSE_STYLE = `
  @keyframes gt-shimmer {
    0%   { opacity: 1; }
    50%  { opacity: 0.4; }
    100% { opacity: 1; }
  }
  .gt-skeleton {
    background: #e7e5e4;
    border-radius: 6px;
    animation: gt-shimmer 1.6s ease-in-out infinite;
  }
  .gt-skeleton-dark {
    background: #292524;
    border-radius: 6px;
    animation: gt-shimmer 1.6s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .gt-skeleton, .gt-skeleton-dark { animation: none; opacity: 0.6; }
  }
`;

let styleInjected = false;
function injectStyle() {
  if (styleInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = PULSE_STYLE;
  document.head.appendChild(el);
  styleInjected = true;
}

// ── Base bone ────────────────────────────────────────────────────────────────
export function Bone({ className, dark = false, style }) {
  if (typeof window !== "undefined") injectStyle();
  return (
    <div
      className={clsx(dark ? "gt-skeleton-dark" : "gt-skeleton", className)}
      style={style}
    />
  );
}

// ── Staggered wrapper — children animate in at slightly different times ───────
export function SkeletonGroup({ children, className }) {
  return (
    <div className={clsx("w-full", className)}>
      {children}
    </div>
  );
}