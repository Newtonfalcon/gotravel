import { ClerkProvider } from "@clerk/nextjs";
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

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://gotravel-alpha.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "GoTravel",

  title: {
    default: "GoTravel | Travel & Holiday Support",
    template: "%s | GoTravel",
  },

  description:
    "GoTravel provides trusted travel services including visa assistance, flight bookings, holiday packages, travel consultations and premium travel courses.",

  keywords: [
    "GoTravel",
    "Travel Agency",
    "Travel Courses",
    "Visa Assistance",
    "Holiday Packages",
    "Flight Booking",
    "Study Abroad",
    "Travel Nigeria",
  ],

  authors: [
    {
      name: "GoTravel",
      url: siteUrl,
    },
  ],

  creator: "GoTravel",
  publisher: "GoTravel",
  category: "Travel",

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: [
      {
        url: "/logo.png",
      },
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "GoTravel",

    title: "GoTravel | Travel & Holiday Support",

    description:
      "Travel smarter with trusted visa support, travel courses and holiday packages.",

    images: [
      {
        url: "https://gotravel-alpha.vercel.app/og-image.png", // Recommended for WhatsApp/Facebook
        width: 1200,
        height: 630,
        alt: "GoTravel",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "GoTravel | Travel & Holiday Support",

    description:
      "Travel smarter with trusted visa support, travel courses and holiday packages.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}