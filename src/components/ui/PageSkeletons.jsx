"use client";

import { Bone } from "./Skeleton";

// ── Shared nav skeleton (light, public pages) ─────────────────────────────────
function NavSkeleton() {
  return (
    <div className="h-16 border-b border-gray-100 flex items-center px-6 justify-between">
      <Bone className="h-8 w-28 rounded-lg" />
      <div className="flex gap-3">
        <Bone className="h-8 w-16 rounded-lg" />
        <Bone className="h-8 w-16 rounded-lg" />
        <Bone className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

// ── Public course card ────────────────────────────────────────────────────────
function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
      {/* thumbnail */}
      <Bone className="w-full aspect-[3/2] rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        <Bone className="h-4 w-1/3 rounded" />
        <Bone className="h-5 w-5/6 rounded" />
        <Bone className="h-4 w-4/6 rounded" />
        <div className="mt-2 pt-4 border-t border-gray-100 flex justify-between items-center">
          <Bone className="h-3.5 w-16 rounded" />
          <Bone className="h-5 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── /courses ──────────────────────────────────────────────────────────────────
export function CoursesPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <NavSkeleton />
      <section className="pt-24 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Bone className="h-4 w-24 rounded mb-3" />
        <Bone className="h-9 w-64 rounded-lg mb-6" />
        <Bone className="h-11 w-full max-w-sm rounded-xl" />
      </section>
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── /courses/[id] (course detail) ────────────────────────────────────────────
export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <NavSkeleton />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Hero area */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          <div className="flex flex-col gap-4">
            <Bone className="h-4 w-20 rounded" />
            <Bone className="h-10 w-full rounded-lg" />
            <Bone className="h-10 w-4/5 rounded-lg" />
            <Bone className="h-5 w-full rounded" />
            <Bone className="h-5 w-3/4 rounded" />
            <div className="flex gap-4 mt-2">
              <Bone className="h-5 w-24 rounded" />
              <Bone className="h-5 w-20 rounded" />
            </div>
            {/* Lesson list */}
            <div className="mt-6 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl">
                  <Bone className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Bone className="h-4 w-2/3 rounded" />
                    <Bone className="h-3 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Sidebar card */}
          <div className="flex flex-col gap-4">
            <Bone className="w-full aspect-video rounded-2xl" />
            <Bone className="h-7 w-1/3 rounded" />
            <Bone className="h-12 w-full rounded-xl" />
            <Bone className="h-4 w-1/2 mx-auto rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── /courses/[id]/learn ───────────────────────────────────────────────────────
export function LearnPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* top bar */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-5 gap-4">
        <Bone className="h-7 w-24 rounded-lg gt-skeleton-dark" dark />
        <Bone className="h-5 w-48 rounded gt-skeleton-dark" dark />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col gap-3 p-4 overflow-y-auto">
          <Bone className="h-4 w-24 rounded mb-1" dark />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
              <Bone className="h-7 w-7 rounded-lg shrink-0" dark />
              <div className="flex-1 flex flex-col gap-1.5">
                <Bone className="h-3.5 w-5/6 rounded" dark />
                <Bone className="h-3 w-1/2 rounded" dark />
              </div>
            </div>
          ))}
        </div>
        {/* Player area */}
        <div className="flex-1 flex flex-col items-center justify-start p-8 gap-6">
          <Bone className="w-full max-w-4xl aspect-video rounded-2xl" dark />
          <div className="w-full max-w-4xl flex flex-col gap-3">
            <Bone className="h-7 w-2/3 rounded-lg" dark />
            <Bone className="h-4 w-full rounded" dark />
            <Bone className="h-4 w-4/5 rounded" dark />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── /dashboard ────────────────────────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavSkeleton />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="flex flex-col gap-2 mb-10">
          <Bone className="h-8 w-48 rounded-lg" />
          <Bone className="h-4 w-64 rounded" />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-2">
              <Bone className="h-4 w-1/2 rounded" />
              <Bone className="h-8 w-1/3 rounded-lg" />
            </div>
          ))}
        </div>
        {/* Enrolled courses */}
        <Bone className="h-5 w-36 rounded mb-5" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
              <Bone className="w-full aspect-[3/2] rounded-none" />
              <div className="p-4 flex flex-col gap-2">
                <Bone className="h-4 w-3/4 rounded" />
                <Bone className="h-3 w-1/2 rounded" />
                <Bone className="h-2 w-full rounded-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── /checkout/[courseId] ──────────────────────────────────────────────────────
export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavSkeleton />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="grid md:grid-cols-[1fr_340px] gap-8">
          {/* Left: order details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
            <Bone className="h-6 w-32 rounded" />
            <div className="flex gap-4 items-center">
              <Bone className="h-20 w-28 rounded-xl shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Bone className="h-5 w-4/5 rounded" />
                <Bone className="h-4 w-1/2 rounded" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Bone className="h-4 w-1/3 rounded" />
                  <Bone className="h-4 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
          {/* Right: payment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            <Bone className="h-6 w-28 rounded" />
            <Bone className="h-11 w-full rounded-xl" />
            <Bone className="h-11 w-full rounded-xl" />
            <Bone className="h-11 w-full rounded-xl" />
            <Bone className="h-12 w-full rounded-xl mt-2" />
            <Bone className="h-4 w-3/4 mx-auto rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin: dark sidebar ───────────────────────────────────────────────────────
function AdminSidebarSkeleton() {
  return (
    <div className="w-60 shrink-0 bg-stone-900 border-r border-stone-800 flex flex-col gap-3 p-4 h-screen">
      <Bone className="h-8 w-28 rounded-lg mb-3" dark />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <Bone className="h-5 w-5 rounded" dark />
          <Bone className="h-4 w-24 rounded" dark />
        </div>
      ))}
    </div>
  );
}

// ── Admin: course card (dark) ─────────────────────────────────────────────────
function AdminCourseCardSkeleton() {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Bone className="h-10 w-10 rounded-xl shrink-0" dark />
        <div className="flex-1 flex flex-col gap-2">
          <Bone className="h-4 w-3/4 rounded" dark />
          <Bone className="h-3.5 w-full rounded" dark />
          <Bone className="h-3.5 w-4/5 rounded" dark />
        </div>
        <Bone className="h-6 w-16 rounded-full shrink-0" dark />
      </div>
      <div className="flex gap-4">
        <Bone className="h-3.5 w-16 rounded" dark />
        <Bone className="h-3.5 w-16 rounded" dark />
        <Bone className="h-3.5 w-12 rounded" dark />
      </div>
      <div className="border-t border-stone-800 pt-4">
        <Bone className="h-10 w-full rounded-xl" dark />
      </div>
    </div>
  );
}

// ── /admin and /admin/courses ─────────────────────────────────────────────────
export function AdminCoursesSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-900">
      <AdminSidebarSkeleton />
      <main className="flex-1 overflow-y-auto bg-stone-950 px-4 py-8 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Bone className="h-6 w-24 rounded" dark />
              <Bone className="h-4 w-48 rounded" dark />
            </div>
            <Bone className="h-10 w-36 rounded-xl" dark />
          </div>
          <Bone className="h-11 w-full max-w-xs rounded-xl" dark />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <AdminCourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── /admin/courses/[courseId] (course detail / lesson list) ──────────────────
export function AdminCourseDetailSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-900">
      <AdminSidebarSkeleton />
      <main className="flex-1 overflow-y-auto bg-stone-950 px-4 py-8 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Bone className="h-4 w-16 rounded" dark />
            <Bone className="h-4 w-4 rounded" dark />
            <Bone className="h-4 w-32 rounded" dark />
          </div>
          {/* Course header */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <Bone className="h-6 w-2/3 rounded" dark />
                <Bone className="h-4 w-full rounded" dark />
              </div>
              <Bone className="h-8 w-20 rounded-full shrink-0" dark />
            </div>
            <div className="flex gap-6">
              <Bone className="h-4 w-20 rounded" dark />
              <Bone className="h-4 w-16 rounded" dark />
              <Bone className="h-4 w-20 rounded" dark />
            </div>
            <div className="flex gap-3 mt-1">
              <Bone className="h-9 w-28 rounded-xl" dark />
              <Bone className="h-9 w-28 rounded-xl" dark />
            </div>
          </div>
          {/* Lessons */}
          <div className="flex items-center justify-between">
            <Bone className="h-5 w-24 rounded" dark />
            <Bone className="h-9 w-28 rounded-xl" dark />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center gap-4">
              <Bone className="h-8 w-8 rounded-lg shrink-0" dark />
              <div className="flex-1 flex flex-col gap-2">
                <Bone className="h-4 w-1/2 rounded" dark />
                <Bone className="h-3.5 w-3/4 rounded" dark />
              </div>
              <div className="flex gap-2 shrink-0">
                <Bone className="h-8 w-8 rounded-lg" dark />
                <Bone className="h-8 w-8 rounded-lg" dark />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ── /admin/courses/create ─────────────────────────────────────────────────────
export function AdminCreateCourseSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-900">
      <AdminSidebarSkeleton />
      <main className="flex-1 overflow-y-auto bg-stone-950 px-4 py-8 sm:px-6 lg:px-10">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Bone className="h-6 w-36 rounded" dark />
            <Bone className="h-4 w-56 rounded" dark />
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Bone className="h-4 w-24 rounded" dark />
                <Bone className="h-11 w-full rounded-xl" dark />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <Bone className="h-4 w-24 rounded" dark />
              <Bone className="h-32 w-full rounded-xl" dark />
            </div>
            <Bone className="h-12 w-full rounded-xl mt-2" dark />
          </div>
        </div>
      </main>
    </div>
  );
}

// ── /admin/users ──────────────────────────────────────────────────────────────
export function AdminUsersSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-900">
      <AdminSidebarSkeleton />
      <main className="flex-1 overflow-y-auto bg-stone-950 px-4 py-8 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Bone className="h-6 w-20 rounded" dark />
              <Bone className="h-4 w-40 rounded" dark />
            </div>
            <Bone className="h-10 w-48 rounded-xl" dark />
          </div>
          {/* Table header */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-3 border-b border-stone-800">
              <Bone className="h-4 w-1/3 rounded" dark />
              <Bone className="h-4 w-1/4 rounded" dark />
              <Bone className="h-4 w-1/5 rounded ml-auto" dark />
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-stone-800/50 last:border-0">
                <Bone className="h-9 w-9 rounded-full shrink-0" dark />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Bone className="h-4 w-36 rounded" dark />
                  <Bone className="h-3.5 w-48 rounded" dark />
                </div>
                <Bone className="h-6 w-14 rounded-full shrink-0" dark />
                <Bone className="h-8 w-8 rounded-lg shrink-0" dark />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── / (landing page) ──────────────────────────────────────────────────────────
export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <NavSkeleton />
      {/* Hero */}
      <div className="pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
        <Bone className="h-4 w-32 rounded-full mt-8" />
        <Bone className="h-14 w-3/4 rounded-xl" />
        <Bone className="h-14 w-2/3 rounded-xl" />
        <Bone className="h-5 w-1/2 rounded" />
        <div className="flex gap-3 mt-2">
          <Bone className="h-12 w-36 rounded-xl" />
          <Bone className="h-12 w-36 rounded-xl" />
        </div>
        <Bone className="w-full max-w-4xl aspect-[16/7] rounded-3xl mt-6" />
      </div>
      {/* Featured courses strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Bone className="h-7 w-48 rounded mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}