// src/lib/blog/fonts.js
import { Bricolage_Grotesque, Literata } from "next/font/google";

/**
 * Blog typography: an expressive grotesque for headlines and a book serif for reading.
 * Both are exposed as CSS variables so any wrapper can opt in:
 *   font-[family-name:var(--font-blog-display)]
 *   font-[family-name:var(--font-blog-reading)]
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-blog-display",
  display: "swap",
});

const reading = Literata({
  subsets: ["latin"],
  variable: "--font-blog-reading",
  display: "swap",
});

export const blogFontVariables = `${display.variable} ${reading.variable}`;