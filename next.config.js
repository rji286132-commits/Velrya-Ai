/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // VELRYA AI Branding
  env: {
    APP_NAME: 'VELRYA AI',
  },

  // Production optimizations
  typescript: {
    ignoreBuildErrors: false, // FIXED - ab error dikhega
  },
  eslint: {
    ignoreDuringBuilds: false, // FIXED - ab error dikhega
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-App-Name', value: 'VELRYA AI' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
