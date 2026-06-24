import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // ── Base URL (required for absolute og/twitter image URLs) ──────────────
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://gotravelcourses.com"
  ),

  // ── Core ─────────────────────────────────────────────────────────────────
  applicationName: "GoTravel",
  title: {
    default: "GoTravel — Travel the World with Confidence",
    template: "%s | GoTravel",          // sub-pages: "About | GoTravel"
  },
  description:
    "GoTravel helps you travel the world with ease. Expert-led courses on budget travel, photography, solo trips, and more — learn at your own pace and explore with confidence.",
  keywords: [
    "travel courses",
    "learn to travel",
    "budget travel",
    "travel photography",
    "solo travel",
    "travel tips",
    "online travel education",
    "GoTravel",
  ],
  authors: [{ name: "GoTravel Team", url: "https://gotravelcourses.com" }],
  creator: "GoTravel",
  publisher: "GoTravel",
  category: "Education",

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", type: "image/png" },   // shown on iOS home screen
    ],
    shortcut: "/logo.png",
  },

  // ── Open Graph (Facebook, WhatsApp, LinkedIn previews) ───────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gotravelcourses.com",
    siteName: "GoTravel",
    title: "GoTravel — Travel the World with Confidence",
    description:
      "Expert-led travel courses that help you explore the world smarter, safer, and on any budget. Join 12,000+ students from 85+ countries.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GoTravel — Travel the World with Confidence",
      },
    ],
  },

  // ── Twitter / X card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "GoTravel — Travel the World with Confidence",
    description:
      "Expert-led travel courses that help you explore the world smarter, safer, and on any budget.",
    images: ["/logo.png"],
    creator: "@gotravelcourses",   // update to your actual handle
  },

  // ── Robots / indexing ────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}