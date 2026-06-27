import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageHref(page, search) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  return `/courses?${params.toString()}`;
}

export default function Pagination({ currentPage, totalPages, search = "" }) {
  if (totalPages <= 1) return null;

  const delta = 2;
  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const btnBase =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors";
  const btnActive = "bg-amber-500 text-black font-bold";
  const btnInactive = "text-gray-500 hover:bg-gray-100 hover:text-gray-900";
  const btnNav =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:border-amber-500 hover:text-amber-600 transition-colors";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1, search)} className={btnNav}>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className={`${btnNav} opacity-30 pointer-events-none`}>
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {start > 1 && (
        <>
          <Link href={pageHref(1, search)} className={`${btnBase} ${btnInactive}`}>1</Link>
          {start > 2 && <span className="w-9 text-center text-gray-300 text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p, search)}
          className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="w-9 text-center text-gray-300 text-sm">…</span>}
          <Link href={pageHref(totalPages, search)} className={`${btnBase} ${btnInactive}`}>{totalPages}</Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1, search)} className={btnNav}>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className={`${btnNav} opacity-30 pointer-events-none`}>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}