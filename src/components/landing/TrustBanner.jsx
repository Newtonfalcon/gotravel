
import { PARTNERS } from "@/data/siteData";
import React from "react";

export default function TrustBanner() {
  return (
    <section className="py-10 sm:py-14 bg-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-bold text-black uppercase tracking-wider mb-6 sm:mb-8">
          Trusted by Nigerian learners featured across
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              className="text-black/70 font-heading font-bold text-base sm:text-lg md:text-xl hover:text-black transition-colors select-none"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
