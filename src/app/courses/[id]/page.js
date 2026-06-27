
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getCourse, getLessons } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, BookOpen, Lock, Play, Tag, CheckCircle } from "lucide-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.title,
    description: course.shortDescription ?? undefined,
  };
}

export default async function CourseDetailPage({ params }) {
  const { id } = await params;

  const [course, lessons] = await Promise.all([getCourse(id), getLessons(id)]);

  if (!course) notFound();

  const previewCount = lessons.filter((l) => l.isPreview).length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-24 sm:pt-28 pb-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            All Courses
          </Link>

          {course.category && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">
              <Tag className="w-3.5 h-3.5" />
              {course.category}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 leading-tight">
            {course.title}
          </h1>

          {course.shortDescription && (
            <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-2xl">
              {course.shortDescription}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
            {lessons.length > 0 && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
              </span>
            )}
            {previewCount > 0 && (
              <span className="flex items-center gap-1.5 text-amber-600">
                <Play className="w-4 h-4" />
                {previewCount} free preview{previewCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-4xl font-bold text-gray-900">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            <Link
              href={`/checkout/${id}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
            >
              Enroll Now
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
            Course Content
          </h2>

          {lessons.length > 0 ? (
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson._id}
                  className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl border transition-colors ${
                    lesson.isPreview
                      ? "border-amber-100 bg-amber-50/40 hover:border-amber-200 hover:bg-amber-50/70"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm ${
                      lesson.isPreview
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {lesson.isPreview ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-semibold leading-snug ${
                          lesson.isPreview ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      {lesson.isPreview && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-white border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                          Free Preview
                        </span>
                      )}
                    </div>
                    {lesson.description && (
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {lesson.description}
                      </p>
                    )}
                  </div>

                  {!lesson.isPreview && (
                    <Lock className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-200 rounded-2xl">
              <BookOpen className="w-10 h-10 text-gray-200 mb-4" />
              <p className="text-sm font-semibold text-gray-400">No lessons yet</p>
              <p className="mt-1 text-xs text-gray-300">Content is being added. Check back soon.</p>
            </div>
          )}

          {lessons.length > 0 && (
            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Ready to start learning?
                </p>
                <ul className="mt-2 space-y-1">
                  {[
                    "Lifetime access",
                    "Learn at your own pace",
                    "30-day money-back guarantee",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/checkout/${id}`}
                className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
              >
                Enroll for {course.price === 0 ? "Free" : `$${course.price}`}
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
