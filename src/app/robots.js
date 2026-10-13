// src/app/robots.js
const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://gotravelsltd.com").replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/checkout", "/payment", "/sign-in", "/sign-up", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}