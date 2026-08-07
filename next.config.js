/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  
  // VELRYA AI Branding
  env: {
    APP_NAME: 'VELRYA AI',
  },

  // Production optimizations
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
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
        ],
      },
    ];
  },
};

module.exports = nextConfig;

