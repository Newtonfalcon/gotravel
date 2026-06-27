"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

const STATUSES = ["all", "published", "draft"];

export default function CourseFilters({ counts }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Build a new URL, keeping both params in sync
  const navigate = useCallback(
    (search, status) => {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      if (status && status !== "all") p.set("status", status);
      router.push(`/admin/courses?${p.toString()}`);
    },
    [router]
  );

  function handleSearchChange(e) {
    const val = e.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => navigate(val, currentStatus), 380);
  }

  function clearSearch() {
    if (inputRef.current) inputRef.current.value = "";
    navigate("", currentStatus);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1 min-w-0 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          defaultValue={currentSearch}
          onChange={handleSearchChange}
          placeholder="Search by title or category…"
          autoComplete="off"
          className="w-full h-11 bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-9 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors"
        />
        {currentSearch && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 active:text-stone-300 hover:text-stone-300 transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-xl p-1 shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 ml-1.5 shrink-0" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => navigate(currentSearch, s)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-150 min-h-[36px] ${
              currentStatus === s
                ? "bg-amber-400 text-stone-950"
                : "text-stone-400 active:text-stone-200 hover:text-stone-200"
            }`}
          >
            {s}
            {counts?.[s] !== undefined && (
              <span className="ml-1.5 opacity-70">{counts[s]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}