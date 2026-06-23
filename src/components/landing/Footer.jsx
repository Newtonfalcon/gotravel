import React from "react";
import Link from "next/link";
import { FOOTER_LINKS, SOCIAL_LINKS, CONTACT_INFO } from "@/data/footerData";
import { ExternalLink, Music2, Mail, Phone, MapPin } from "lucide-react";

const ICON_MAP = {
  Instagram: ExternalLink,
  Facebook: ExternalLink,
  Youtube: ExternalLink,
  Twitter: ExternalLink,
  Linkedin: ExternalLink,
  Music2: Music2,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-14 pb-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Logo" className="h-9 w-auto brightness-0 invert" />
              <span className="text-xl font-heading font-bold text-white">
                TravelCourses
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 max-w-xs">
              Empowering thousands of travelers with the knowledge and confidence
              to explore the world smarter.
            </p>

            <div className="mt-6 space-y-2.5">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                {CONTACT_INFO.email}
              </a>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {CONTACT_INFO.phone}
              </a>
              <div className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                {CONTACT_INFO.address}
              </div>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; {year} TravelCourses. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = ICON_MAP[social.icon];
              if (!Icon) return null;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-amber-500 hover:text-black transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}