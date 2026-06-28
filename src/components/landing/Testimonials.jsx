
import React from "react";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/siteData";

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
      <Quote className="w-8 h-8 text-amber-400 mb-4" />
      <p className="text-gray-600 leading-relaxed flex-1 text-sm sm:text-base">
        "{testimonial.content}"
      </p>
      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-sm shrink-0">
            {testimonial.initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
            <p className="text-xs text-gray-400">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
            What Our Students Say
          </h2>
          <p className="mt-3 text-gray-500">
            Real stories from Nigerians who used GoTravel to achieve their travel dreams.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}


