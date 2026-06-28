
import React from "react";
import Link from "next/link";
import { Star, Users, Clock, ArrowRight } from "lucide-react";
import { FEATURED_COURSES } from "@/data/siteData";

function CourseCard({ course }) {
  const initial = course.title.charAt(0).toUpperCase();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden aspect-[3/2] bg-gradient-to-br from-amber-50 to-orange-100">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl font-bold text-amber-300 select-none">
              {initial}
            </span>
          </div>
        )}
        <span className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
          {course.level}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-heading font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
          {course.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.students.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{course.price}</span>
            <span className="text-sm text-gray-400 line-through">{course.originalPrice}</span>
          </div>
          <Link
            href="/courses"
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            Enroll
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCourses() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
            Popular Courses
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
            Start Your Journey Today
          </h2>
          <p className="mt-3 text-gray-500">
            Courses built specifically for Nigerians — from visa applications to landing abroad confidently.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors text-sm"
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
