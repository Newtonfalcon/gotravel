import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getCourse, getLessons } from "@/lib/data";
import CoursePlayer from "@/components/courses/CoursePlayer";
import Link from "next/link";
import { ChevronLeft, BookOpen, Clock } from "lucide-react";

// Per-request render so the purchase check always reflects the live user session
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} — Learn`,
    description: course.shortDescription ?? undefined,
  };
}

export default async function LearnPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;

  // ── 1. Require auth (redirects to /sign-in if not signed in) ──────────────
  // getUser() is memoised with React cache() so this is one DB call per request
  // even if both this page and the dashboard layout call requireAuth()
  const user = await requireAuth();

  // ── 2. Ownership check ─────────────────────────────────────────────────────
  // Payment stores courses as MongoDB ObjectIds via $addToSet: { courses: course._id }
  // so we must compare with .toString() — same pattern the dashboard uses
  const hasPurchased = (user.courses ?? []).some(
    (cId) => cId.toString() === id
  );

  if (!hasPurchased) {
    // Not enrolled — send to the course page where they can buy
    redirect(`/courses/${id}`);
  }

  // ── 3. Fetch course + lessons (both server-cached via unstable_cache) ───────
  const [course, lessons] = await Promise.all([getCourse(id), getLessons(id)]);

  if (!course) notFound();

  // ── 4. No lessons yet ────────────────────────────────────────────────────────
  if (!lessons.length) {
    return (
      <div className="h-[100dvh] flex flex-col bg-gray-950">
        {/* Same top bar as CoursePlayer */}
        <header className="shrink-0 h-14 flex items-center px-4 bg-gray-900 border-b border-gray-800 z-20">
          <Link
            href={`/courses/${id}`}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to course</span>
          </Link>
          <div className="w-px h-5 bg-gray-700 mx-3" />
          <p className="text-white text-sm font-semibold truncate">{course.title}</p>
        </header>

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="flex flex-col items-center text-center max-w-xs">
            {/* Icon stack */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                <BookOpen className="w-9 h-9 text-gray-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <h1 className="text-white text-lg font-bold tracking-tight">
              No lessons yet
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Content for this course is still being prepared. Check back soon.
            </p>

            {/* Divider */}
            <div className="mt-8 w-full h-px bg-gray-800" />

            <Link
              href={`/courses/${id}`}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-sm font-medium text-gray-300 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to course page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── 5. Resolve the active lesson from ?lesson= query param ─────────────────
  const activeId = sp?.lesson ?? lessons[0]._id;
  const activeLesson =
    lessons.find((l) => l._id === activeId) ?? lessons[0];

  return (
    <CoursePlayer
      course={course}
      lessons={lessons}
      initialLesson={activeLesson}
      courseId={id}
      isPaid={true}
    />
  );
}