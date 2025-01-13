import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/bookstore-backend-a40e9.appspot.com/**",
      },
    ], // Thêm hostname tại đây
  },
};

export default nextConfig;
