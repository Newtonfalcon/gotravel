import Link from "next/link";
import { Suspense } from "react";
import {
  BookOpen, Plus, Globe, FileText,
  Users, LayoutGrid, ArrowRight, Pencil,
} from "lucide-react";
import { getAdminCourses, getAdminStats } from "@/lib/data";

export const metadata = { title: "Dashboard — Admin" };

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

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-stone-100 leading-none tabular-nums">{value}</p>
        <p className="mt-1 text-xs font-semibold text-stone-400">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-stone-600">{sub}</p>}
      </div>
    </div>
  );
}

// ── Stats row (async) ─────────────────────────────────────────────────────────
async function StatsRow() {
  const stats = await getAdminStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total courses"
        value={stats.total}
        sub={`${stats.published} published · ${stats.draft} draft`}
        icon={LayoutGrid}
        accent="bg-amber-400/10 border border-amber-400/20 text-amber-400"
      />
      <StatCard
        label="Published"
        value={stats.published}
        sub="Live for students"
        icon={Globe}
        accent="bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
      />
      <StatCard
        label="Total lessons"
        value={stats.lessonCount}
        sub="Across all courses"
        icon={BookOpen}
        accent="bg-blue-400/10 border border-blue-400/20 text-blue-400"
      />
      <StatCard
        label="Total users"
        value={stats.userCount}
        sub="Registered accounts"
        icon={Users}
        accent="bg-purple-400/10 border border-purple-400/20 text-purple-400"
      />
    </div>
  );
}

// ── Recent courses table (async) ───────────────────────────────────────────────
async function RecentCourses() {
  const all = await getAdminCourses(); // already cached — 0 extra DB cost
  const recent = all.slice(0, 8);     // already sorted by createdAt desc

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-stone-800 rounded-2xl text-center">
        <BookOpen className="w-8 h-8 text-stone-700 mb-3" />
        <p className="text-sm font-semibold text-stone-500">No courses yet</p>
        <Link
          href="/admin/courses/create"
          className="mt-4 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-amber-400 text-stone-950 text-xs font-bold hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create first course
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
      {/* Table head */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_100px_80px_80px_120px] gap-4 px-5 py-3 border-b border-stone-800">
        {["Course", "Category", "Price", "Lessons", "Updated"].map((h) => (
          <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-stone-600">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <ul className="divide-y divide-stone-800">
        {recent.map((course) => (
          <li key={course._id}>
            <div className="flex sm:grid sm:grid-cols-[1fr_100px_80px_80px_120px] items-center gap-4 px-5 py-4">

              {/* Title + status */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 text-amber-400 font-bold text-xs">
                  {course.title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-100 truncate leading-tight">{course.title}</p>
                  <span className={`mt-1 inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS_STYLES[course.status] ?? STATUS_STYLES.draft}`}>
                    {course.status}
                  </span>
                </div>
              </div>

              {/* Category */}
              <span className="hidden sm:block text-xs text-stone-500 truncate">{course.category ?? "—"}</span>

              {/* Price */}
              <span className="hidden sm:block text-xs text-stone-400 font-semibold">
                {!course.price || course.price === 0 ? "Free" : `$${Number(course.price).toFixed(0)}`}
              </span>

              {/* Lesson count */}
              <span className="hidden sm:block text-xs text-stone-500 tabular-nums">
                {course.lessonCount ?? 0}
              </span>

              {/* Updated + actions */}
              <div className="ml-auto sm:ml-0 flex items-center justify-end gap-2 shrink-0">
                <span className="hidden sm:block text-xs text-stone-600">{fmtDate(course.updatedAt)}</span>
                <Link
                  href={`/admin/courses/${course._id}/edit`}
                  title="Edit course details"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 text-stone-400 hover:text-amber-400 hover:border-amber-400/40 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/admin/courses/${course._id}`}
                  title="Open course builder"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-100 hover:border-stone-600 transition-all"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer link */}
      {all.length > 8 && (
        <div className="px-5 py-4 border-t border-stone-800">
          <Link
            href="/admin/courses"
            className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-amber-400 transition-colors"
          >
            View all {all.length} courses
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Skeleton placeholders ──────────────────────────────────────────────────────
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 h-24 animate-pulse" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-stone-800 last:border-0 animate-pulse">
          <div className="h-4 bg-stone-800 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-stone-100">Dashboard</h1>
            <p className="mt-1 text-sm text-stone-500">{today}</p>
          </div>
          <Link
            href="/admin/courses/create"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-amber-400 text-stone-950 text-sm font-bold hover:bg-amber-300 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            New course
          </Link>
        </div>

        {/* ── Stats ── */}
        <Suspense fallback={<StatsSkeleton />}>
          <StatsRow />
        </Suspense>

        {/* ── Recent courses ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-100 uppercase tracking-widest">Recent Courses</h2>
            <Link
              href="/admin/courses"
              className="text-xs font-semibold text-stone-500 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <Suspense fallback={<TableSkeleton />}>
            <RecentCourses />
          </Suspense>
        </section>

        {/* ── Quick actions ── */}
        <section>
          <h2 className="text-sm font-bold text-stone-100 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/admin/courses/create", icon: Plus,      label: "Create new course",  sub: "Start with a title and price" },
              { href: "/admin/courses",        icon: LayoutGrid, label: "Manage courses",     sub: "View, filter, and edit all courses" },
              { href: "/admin/users",          icon: Users,      label: "View users",         sub: "Browse registered accounts" },
            ].map(({ href, icon: Icon, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 text-stone-400 group-hover:text-amber-400 group-hover:border-amber-400/30 group-hover:bg-amber-400/5 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-200 group-hover:text-stone-100 transition-colors">{label}</p>
                  <p className="text-xs text-stone-600 mt-0.5">{sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-700 group-hover:text-stone-500 ml-auto shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
