
import Link from "next/link";
import { Suspense } from "react";
import {
  Plus, BookOpen, ExternalLink, Clock, Tag, DollarSign,
} from "lucide-react";
import { getAdminCourses } from "@/lib/data";
import CourseFilters from "@/components/admin/CourseFilters";

export const metadata = { title: "Courses — Admin" };

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const STATUS_STYLES = {
  published: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  draft:     "bg-stone-700/40 text-stone-400 border border-stone-600/30",
};

// ── Course card (server-rendered) ────────────────────────────────────────────
function CourseCard({ course }) {
  const initial = course.title.charAt(0).toUpperCase();

  return (
    <div className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-stone-700 transition-colors duration-150">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 text-amber-400 font-bold text-sm">
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-stone-100 leading-snug line-clamp-2">
              {course.title}
            </h3>
            {course.shortDescription && (
              <p className="mt-0.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {course.shortDescription}
              </p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_STYLES[course.status] ?? STATUS_STYLES.draft}`}
        >
          {course.status}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 flex-wrap">
        {course.category && (
          <div className="flex items-center gap-1.5 text-stone-500 text-xs">
            <Tag className="w-3 h-3" />
            <span>{course.category}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
          <BookOpen className="w-3 h-3" />
          <span>
            {(course.lessonCount ?? 0) === 0
              ? "No lessons"
              : `${course.lessonCount} lesson${course.lessonCount !== 1 ? "s" : ""}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
          <DollarSign className="w-3 h-3" />
          <span>
            {!course.price || course.price === 0
              ? "Free"
              : `$${Number(course.price).toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-500 text-xs ml-auto">
          <Clock className="w-3 h-3" />
          <span>{fmtDate(course.updatedAt)}</span>
        </div>
      </div>

      {/* Action */}
      <div className="border-t border-stone-800 pt-4">
        <Link
          href={`/admin/courses/${course._id}`}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-stone-950 border border-stone-700 text-stone-300 text-xs font-semibold hover:border-amber-400/50 hover:text-amber-400 active:border-amber-400/50 active:text-amber-400 transition-all duration-150"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Course
        </Link>
      </div>
    </div>
  );
}

// ── Skeleton for Suspense ─────────────────────────────────────────────────────
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 h-44 animate-pulse" />
      ))}
    </div>
  );
}

// ── Course grid (async) ───────────────────────────────────────────────────────
async function CourseGrid({ search, status }) {
  const all = await getAdminCourses();

  // Filter in-memory — data is already cached, no extra DB round-trips
  const filtered = all.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || status === "all" || c.status === status;
    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mb-4">
          <BookOpen className="w-5 h-5 text-stone-600" />
        </div>
        <p className="text-stone-400 text-sm font-semibold">
          {search ? `No courses match "${search}"` : "No courses yet"}
        </p>
        <p className="mt-1 text-stone-600 text-xs">
          {search
            ? "Try a different term or clear the filter."
            : "Create your first course to get started."}
        </p>
        {!search && (
          <Link
            href="/admin/courses/create"
            className="mt-5 inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-amber-400 text-stone-950 text-sm font-bold hover:bg-amber-300 active:bg-amber-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add new course
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminCoursesPage({ searchParams }) {
  const sp = await searchParams;
  const search = sp?.search ?? "";
  const status = sp?.status ?? "all";

  // Counts for filter badges — fetch once, filter client-side
  const all = await getAdminCourses();
  const counts = {
    all: all.length,
    published: all.filter((c) => c.status === "published").length,
    draft: all.filter((c) => c.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-stone-100">Courses</h1>
            <p className="mt-1 text-sm text-stone-500">
              {counts.all} total &middot;{" "}
              <span className="text-emerald-400">{counts.published} published</span>
              {" "}&middot;{" "}
              <span className="text-stone-400">{counts.draft} draft</span>
            </p>
          </div>
          <Link
            href="/admin/courses/create"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-amber-400 text-stone-950 text-sm font-bold hover:bg-amber-300 active:bg-amber-300 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add new course
          </Link>
        </div>

        {/* Filters — client component so search input is interactive */}
        <Suspense fallback={null}>
          <CourseFilters counts={counts} />
        </Suspense>

        {/* Course grid — wrapped in Suspense so filters don't block render */}
        <Suspense fallback={<GridSkeleton />}>
          <CourseGrid search={search} status={status} />
        </Suspense>

      </div>
    </div>
  );
}
