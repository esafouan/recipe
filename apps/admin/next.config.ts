import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images for production (FREE)
  images: {
    // Enable modern formats
    formats: ["image/webp", "image/avif"],

    // Responsive breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimization
    minimumCacheTTL: 31536000, // 1 year cache

    // Allow external domains for DigitalOcean Spaces
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minirecipe.sfo3.cdn.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minirecipe.sfo3.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
    ],

    // Allow optimization of local images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression
  compress: true,

  // PWA-like caching for /pictures directory
  headers: async () => {
    return [
      {
        source: "/pictures/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year cache
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  // Custom rewrites to serve images from shared directory
  async rewrites() {
    return [
      {
        source: "/pictures/:path*",
        destination: "/api/pictures/:path*",
      },
    ];
  },
};

export default nextConfig;
