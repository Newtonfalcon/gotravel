import { STATS } from "@/data/siteData";
import React from "react";
//import { STATS } from "@/lib/siteData";

export default function StatsBar() {
    
  return (
    <section className="bg-gray-950 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-amber-500">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm sm:text-base text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}