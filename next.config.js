/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Disable optimizeCss to avoid critters issues
    optimizeCss: false,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-slot",
    ],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Moved from experimental to root level
  serverExternalPackages: ["sharp"],
  poweredByHeader: false,
  compress: true,

  // Simplified webpack config to avoid errors
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig
