/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for better performance
    unoptimized: false,
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
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Performance optimizations
  swcMinify: true, // Use SWC for faster minification
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Bundle optimization
  experimental: {
    // Remove optimizeCss to fix critters error
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Compression
  compress: true,
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === "true") {
      const withBundleAnalyzer = require("@next/bundle-analyzer")({
        enabled: true,
      });
      return withBundleAnalyzer.webpack(config, { dev, isServer });
    }

    if (!dev && !isServer) {
      // Production client-side optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
            },
            common: {
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  // Headers for caching and security
  async headers() {
    return [
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
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/pictures/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
