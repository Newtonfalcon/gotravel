import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, DollarSign, Tag, Play, Lock,
  CheckCircle, Video, Pencil,
} from "lucide-react";
import { getAdminCourseWithLessons } from "@/lib/data";
import AddLessonForm from "@/components/admin/AddLessonForm";

export async function generateMetadata({ params }) {
  const { courseId } = await params;
  const result = await getAdminCourseWithLessons(courseId);
  if (!result) return { title: "Course Not Found — Admin" };
  return { title: `${result.course.title} — Admin` };
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  published: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  draft:     "bg-stone-700/40 text-stone-400 border border-stone-600/30",
};

// ── Single lesson row ─────────────────────────────────────────────────────────
function LessonRow({ lesson, index }) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
        lesson.isPreview
          ? "border-amber-400/20 bg-amber-400/5"
          : "border-stone-800 bg-stone-900"
      }`}
    >
      {/* Order / play icon */}
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
          lesson.isPreview
            ? "bg-amber-400/15 text-amber-400"
            : "bg-stone-800 text-stone-500"
        }`}
      >
        {lesson.isPreview ? <Play className="w-3.5 h-3.5" /> : String(index + 1).padStart(2, "0")}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-semibold leading-snug ${lesson.isPreview ? "text-stone-100" : "text-stone-300"}`}>
            {lesson.title}
          </p>
          {lesson.isPreview && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full shrink-0">
              Free Preview
            </span>
          )}
        </div>
        {lesson.description && (
          <p className="mt-1 text-xs text-stone-500 line-clamp-1 leading-relaxed">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Lock for non-preview */}
      {!lesson.isPreview && (
        <Lock className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CourseBuilderPage({ params }) {
  const { courseId } = await params;
  const result = await getAdminCourseWithLessons(courseId);

  if (!result) notFound();

  const { course, lessons } = result;
  const previewCount = lessons.filter((l) => l.isPreview).length;

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Back + Course header ── */}
        <div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-amber-400 active:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Courses
          </Link>

          <div className="mt-6 bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 text-amber-400 font-bold text-base">
                  {course.title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold text-stone-100 leading-snug line-clamp-2">
                    {course.title}
                  </h1>
                  {course.shortDescription && (
                    <p className="mt-0.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {course.shortDescription}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_STYLES[course.status] ?? STATUS_STYLES.draft}`}
                >
                  {course.status}
                </span>
                <Link
                  href={`/admin/courses/${courseId}/edit`}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-stone-800 border border-stone-700 text-stone-400 text-xs font-semibold hover:text-amber-400 hover:border-amber-400/40 transition-all duration-150"
                >
                  <Pencil className="w-3 h-3" />
                  Edit details
                </Link>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 flex-wrap border-t border-stone-800 pt-4">
              {course.category && (
                <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                  <Tag className="w-3 h-3" />
                  <span>{course.category}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                <BookOpen className="w-3 h-3" />
                <span>
                  {lessons.length === 0
                    ? "No lessons yet"
                    : `${lessons.length} lesson${lessons.length !== 1 ? "s" : ""}`}
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
            </div>
          </div>
        </div>

        {/* ── Lessons list ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-100 uppercase tracking-widest">
              Lessons
            </h2>
            {lessons.length > 0 && (
              <p className="text-xs text-stone-500">
                {lessons.length} total
                {previewCount > 0 && ` · ${previewCount} free preview${previewCount !== 1 ? "s" : ""}`}
              </p>
            )}
          </div>

          {lessons.length > 0 ? (
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <LessonRow key={lesson._id} lesson={lesson} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 border border-dashed border-stone-800 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-stone-700" />
              </div>
              <p className="text-sm font-semibold text-stone-500">No lessons yet</p>
              <p className="mt-1 text-xs text-stone-600">Add your first lesson below.</p>
            </div>
          )}
        </section>

        {/* ── Add lesson form ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-100">Add Lesson</h2>
              <p className="text-xs text-stone-500">Upload a video and fill in the details below.</p>
            </div>
          </div>

          {/* Client component handles all form interaction */}
          <AddLessonForm courseId={courseId} />
        </section>

        {/* ── Checklist tip ── */}
        {lessons.length > 0 && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <p className="text-xs font-semibold text-stone-400 mb-3 uppercase tracking-widest">
              Publishing checklist
            </p>
            <ul className="space-y-2">
              {[
                { label: "At least one lesson added", done: lessons.length > 0 },
                { label: "At least one free preview", done: previewCount > 0 },
                { label: "Course price set", done: course.price != null },
                { label: "Category assigned", done: !!course.category },
              ].map(({ label, done }) => (
                <li key={label} className="flex items-center gap-2.5 text-xs">
                  <CheckCircle
                    className={`w-3.5 h-3.5 shrink-0 ${done ? "text-emerald-400" : "text-stone-700"}`}
                  />
                  <span className={done ? "text-stone-300" : "text-stone-600"}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}