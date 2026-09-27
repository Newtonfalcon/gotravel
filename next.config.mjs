
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "media.base44.com" },
      { protocol: "https", hostname: "*.bunnycdn.com" },
    ],
  },
};

export default nextConfig;
