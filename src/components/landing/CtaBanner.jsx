
import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
          Ready to Explore the World
          <span className="text-amber-500"> Smarter?</span>
        </h2>
        <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Join 8,000+ Nigerians already learning to travel better. Your next
          adventure is one course away.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            Browse Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://wa.me/2349038162915"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border border-gray-700 text-gray-300 hover:border-green-500 hover:text-green-400 font-medium rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
