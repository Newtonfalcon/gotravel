"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

export default function SearchBar({ defaultValue = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function submit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("search", value.trim());
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clear() {
    setValue("");
    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-md">
      {isPending ? (
        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 animate-spin pointer-events-none" />
      ) : (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search courses…"
        className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors rounded-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}