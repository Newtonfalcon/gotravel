"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  BookOpen,
  ExternalLink,
  Clock,
  Tag,
  DollarSign,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const DUMMY_COURSES = [
  {
    _id: "6650a1f2e4b0c2a3d8f90001",
    title: "Budget Travel Mastery",
    shortDescription:
      "Learn how to explore the world on a shoestring — from flight hacks to free accommodation strategies that actually work.",
    thumbnail: null,
    category: "Budget Travel",
    price: 49,
    lessonCount: 12,
    status: "published",
    createdAt: "2025-03-10T09:00:00.000Z",
    updatedAt: "2025-05-18T14:22:00.000Z",
  },
  {
    _id: "6650a1f2e4b0c2a3d8f90002",
    title: "Solo Travel Confidence",
    shortDescription:
      "A practical guide for first-time solo travellers — safety, planning, meeting people, and making the most of every trip.",
    thumbnail: null,
    category: "Solo Travel",
    price: 79,
    lessonCount: 9,
    status: "published",
    createdAt: "2025-04-02T11:15:00.000Z",
    updatedAt: "2025-06-01T08:05:00.000Z",
  },
  {
    _id: "6650a1f2e4b0c2a3d8f90003",
    title: "Travel Photography Fundamentals",
    shortDescription:
      "Capture destinations the way you actually experienced them — composition, light, mobile gear, and editing workflows.",
    thumbnail: null,
    category: "Photography",
    price: 99,
    lessonCount: 15,
    status: "draft",
    createdAt: "2025-05-20T16:40:00.000Z",
    updatedAt: "2025-06-10T10:30:00.000Z",
  },
  {
    _id: "6650a1f2e4b0c2a3d8f90004",
    title: "Digital Nomad Launchpad",
    shortDescription:
      "Everything you need to work remotely from anywhere — visas, banking, co-working, and building a location-independent income.",
    thumbnail: null,
    category: "Digital Nomad",
    price: 149,
    lessonCount: 20,
    status: "published",
    createdAt: "2025-02-14T07:00:00.000Z",
    updatedAt: "2025-05-30T12:00:00.000Z",
  },
  {
    _id: "6650a1f2e4b0c2a3d8f90005",
    title: "Cultural Immersion Travel",
    shortDescription:
      "Go beyond tourist spots — how to connect with locals, learn languages on the road, and travel with genuine respect.",
    thumbnail: null,
    category: "Cultural Immersion",
    price: 0,
    lessonCount: 0,
    status: "draft",
    createdAt: "2025-06-12T09:50:00.000Z",
    updatedAt: "2025-06-12T09:50:00.000Z",
  },
  {
    _id: "6650a1f2e4b0c2a3d8f90006",
    title: "Adventure Travel Planning",
    shortDescription:
      "Trek, climb, kayak, and camp your way across the globe — gear lists, safety protocols, and booking adventure tours.",
    thumbnail: null,
    category: "Adventure",
    price: 79,
    lessonCount: 11,
    status: "published",
    createdAt: "2025-01-28T14:00:00.000Z",
    updatedAt: "2025-04-22T17:45:00.000Z",
  },
];

const STATUS_STYLES = {
  published: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  draft: "bg-stone-700/40 text-stone-400 border border-stone-600/30",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CourseCard({ course }) {
  const initial = course.title.charAt(0).toUpperCase();

  return (
    <div className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-stone-700 transition-colors duration-150">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 text-amber-400 font-bold text-sm">
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-stone-100 leading-snug truncate">
              {course.title}
            </h3>
            <p className="mt-0.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {course.shortDescription}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_STYLES[course.status] ?? STATUS_STYLES.draft}`}
        >
          {course.status}
        </span>
      </div>

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
            {course.lessonCount === 0
              ? "No lessons yet"
              : `${course.lessonCount} lesson${course.lessonCount !== 1 ? "s" : ""}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
          <DollarSign className="w-3 h-3" />
          <span>
            {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-500 text-xs ml-auto">
          <Clock className="w-3 h-3" />
          <span>{formatDate(course.updatedAt)}</span>
        </div>
      </div>

      <div className="border-t border-stone-800 pt-4">
        <Link
          href={`/admin/courses/${course._id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-300 text-xs font-semibold hover:border-amber-400/50 hover:text-amber-400 transition-all duration-150"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Course
        </Link>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = DUMMY_COURSES.filter((c) => {
    const matchSearch =
      search.trim() === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || c.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const published = DUMMY_COURSES.filter((c) => c.status === "published").length;
  const draft = DUMMY_COURSES.filter((c) => c.status === "draft").length;

  return (
    <div className="min-h-screen bg-stone-950 px-6 py-8 lg:px-10 lg:py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-stone-100">Courses</h1>
            <p className="mt-1 text-sm text-stone-500">
              {DUMMY_COURSES.length} total &middot;{" "}
              <span className="text-emerald-400">{published} published</span>
              {" "}&middot;{" "}
              <span className="text-stone-400">{draft} draft</span>
            </p>
          </div>

          <Link
            href="/admin/courses/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 text-sm font-bold hover:bg-amber-300 transition-colors duration-150 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add new course
          </Link>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-0 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category…"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2.5 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-xl p-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 ml-1.5" />
            {["all", "published", "draft"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 ${
                  statusFilter === s
                    ? "bg-amber-400 text-stone-950"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-stone-600" />
            </div>
            <p className="text-stone-400 text-sm font-semibold">
              {search ? `No courses match "${search}"` : "No courses yet"}
            </p>
            <p className="mt-1 text-stone-600 text-xs">
              {search
                ? "Try a different search term or clear the filter."
                : "Create your first course to get started."}
            </p>
            {!search && (
              <Link
                href="/admin/courses/create"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 text-sm font-bold hover:bg-amber-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add new course
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}