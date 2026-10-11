// src/components/blog/CoverFallback.jsx
import { Compass } from "lucide-react";
import { clsx } from "clsx";
import { hashString } from "@/lib/blog/utils";

const PALETTES = [
  { bg: "from-amber-300 via-amber-400 to-orange-500", line: "stroke-stone-900/30", icon: "text-stone-900/35" },
  { bg: "from-stone-700 via-stone-900 to-stone-950", line: "stroke-amber-400/50", icon: "text-amber-400/40" },
  { bg: "from-teal-500 via-teal-700 to-emerald-900", line: "stroke-white/35", icon: "text-white/30" },
  { bg: "from-sky-500 via-blue-600 to-indigo-800", line: "stroke-white/35", icon: "text-white/30" },
];

/** Deterministic travel-themed artwork for posts without a cover image. */
export default function CoverFallback({ seed = "", className }) {
  const palette = PALETTES[hashString(seed) % PALETTES.length];
  const flip = hashString(`${seed}-flip`) % 2 === 1;

  return (
    <div
      aria-hidden="true"
      className={clsx("relative h-full w-full overflow-hidden bg-gradient-to-br", palette.bg, className)}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className={clsx("absolute inset-0 h-full w-full", flip && "-scale-x-100")}
      >
        <path
          d="M-10 250 C 70 70, 170 290, 230 140 S 340 40, 420 70"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 11"
          className={palette.line}
        />
        <circle cx="52" cy="206" r="6" fill="none" strokeWidth="2" className={palette.line} />
        <circle cx="230" cy="140" r="6" fill="none" strokeWidth="2" className={palette.line} />
      </svg>
      <Compass className={clsx("absolute bottom-4 right-4 size-12", palette.icon)} strokeWidth={1.25} />
    </div>
  );
}