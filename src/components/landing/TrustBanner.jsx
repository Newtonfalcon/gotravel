import { PARTNERS } from "@/data/siteData";
import React from "react";
//import { PARTNERS } from "@/siteData/siteData";

export default function TrustBanner() {
    
  return (
    <section className="py-10 sm:py-14 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider mb-6 sm:mb-8">
          Trusted by learners featured on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              className="text-gray-300 font-heading font-bold text-lg sm:text-xl md:text-2xl hover:text-gray-500 transition-colors select-none"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}