import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { BookOpen, ArrowRight, Play, Clock, Trophy, LayoutDashboard } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// Fetch the full course docs for every courseId the user owns
async function getUserCourses(courseIds = []) {
  if (!courseIds.length) return [];

  const client = await clientPromise;
  const db = client.db("gotravel");

  // courseIds are stored as ObjectId in the users.courses array
  const objectIds = courseIds
    .map((id) => {
      try {
        return new ObjectId(id.toString());
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if (!objectIds.length) return [];

  const courses = await db
    .collection("courses")
    .find({ _id: { $in: objectIds } })
    .project({
      title: 1,
      shortDescription: 1,
      thumbnail: 1,
      category: 1,
      lessonCount: 1,
    })
    .toArray();

  return courses.map((c) => ({ ...c, _id: c._id.toString() }));
}

export default async function DashboardPage() {
  const user = await requireAuth();
  const courses = await getUserCourses(user.courses ?? []);

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium mb-2">
              <LayoutDashboard className="w-4 h-4" />
              My Dashboard
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
            </h1>
            <p className="mt-1 text-gray-500">
              {courses.length > 0
                ? `You have access to ${courses.length} course${courses.length !== 1 ? "s" : ""}.`
                : "Start your learning journey by enrolling in a course."}
            </p>
          </div>

          {/* ── Stats bar ──────────────────────────────────────────────── */}
          {courses.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: BookOpen, label: "Courses Enrolled", value: courses.length },
                { icon: Clock, label: "Lifetime Access", value: "Always" },
                { icon: Trophy, label: "Your Goal", value: "Keep Going" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── My Courses ─────────────────────────────────────────────── */}
          {courses.length > 0 ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                My Courses
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
                          <BookOpen className="w-10 h-10 text-amber-300" />
                        </div>
                      )}

                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <Play className="w-5 h-5 text-amber-500 fill-amber-500 ml-0.5" />
                        </div>
                      </div>

                      {course.category && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-white/90 backdrop-blur-sm border border-amber-100 px-2 py-0.5 rounded-full">
                          {course.category}
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                        {course.title}
                      </h3>
                      {course.shortDescription && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                          {course.shortDescription}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.lessonCount ?? 0} lesson
                          {course.lessonCount !== 1 ? "s" : ""}
                        </span>

                        <Link
                          href={`/courses/${course._id}/learn`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-500 px-3.5 py-2 rounded-lg transition-colors"
                        >
                          Continue
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ── Empty state ─────────────────────────────────────────── */
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Browse our catalogue and enrol in your first course to get started.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
              >
                Browse Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}