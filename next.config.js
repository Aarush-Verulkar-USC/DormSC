/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This will ignore all linting errors and warnings during build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig