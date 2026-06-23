import React from "react";
import {
  Shield,
  GraduationCap,
  Clock,
  Award,
  Headphones,
  RefreshCw,
} from "lucide-react";
import { BENEFITS } from "@/data/siteData";
//import { BENEFITS } from "@/lib/siteData";

const ICON_MAP = {
  Shield,
  GraduationCap,
  Clock,
  Award,
  HeadphonesIcon: Headphones,
  RefreshCw,
};

export default function Benefits() {
    
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
            Built on Trust, Backed by Results
          </h2>
          <p className="mt-3 text-gray-500">
            Everything you need to travel smarter, safer, and more affordably —
            all in one place.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BENEFITS.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon];
            return (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                  {Icon && (
                    <Icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-heading font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}