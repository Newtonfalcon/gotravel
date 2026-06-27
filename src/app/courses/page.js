
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SearchBar from "@/components/courses/SearchBar";
import Pagination from "@/components/courses/Pagination";
import { getCourses } from "@/lib/data";
import Link from "next/link";
import { BookOpen, ArrowRight, Search } from "lucide-react";

export const metadata = { title: "Courses" };

function CourseCard({ course }) {
  const initial = course.title.charAt(0).toUpperCase();

  return (
    <Link
      href={`/courses/${course._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[3/2] bg-gradient-to-br from-amber-50 to-orange-50">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-amber-200 select-none">
              {initial}
            </span>
          </div>
        )}
        {course.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-2.5 py-1 rounded-full border border-white/60">
            {course.category}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-heading font-bold text-gray-900 group-hover:text-amber-600 transition-colors leading-snug">
          {course.title}
        </h3>
        {course.shortDescription && (
          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {course.shortDescription}
          </p>
        )}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          {course.lessonCount > 0 ? (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <BookOpen className="w-3.5 h-3.5" />
              {course.lessonCount} lesson{course.lessonCount !== 1 ? "s" : ""}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CoursesPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page ?? "1"));
  const search = sp?.search ?? "";

  const { courses, pagination } = await getCourses(page, 12, search);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-24 sm:pt-28 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
            All Courses
          </span>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">
              Browse Our Courses
            </h1>
            <p className="text-sm text-gray-400 shrink-0 pb-1">
              {pagination.total} course{pagination.total !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <SearchBar key={search} defaultValue={search} />
            {search && (
              <p className="text-sm text-gray-500 shrink-0">
                {pagination.total} result{pagination.total !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold text-gray-700">&ldquo;{search}&rdquo;</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              <div className="mt-12">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  search={search}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
                <Search className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900">
                {search ? "No courses found" : "No courses yet"}
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                {search
                  ? `Nothing matched "${search}". Try a different term or clear the search.`
                  : "Check back soon — courses are being added."}
              </p>
              {search && (
                <Link
                  href="/courses"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors"
                >
                  Clear search
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
