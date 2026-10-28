/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.222:3001/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://192.168.1.222:3001/uploads/:path*',
      },
      {
        source: '/product-images/:path*',
        destination: 'http://192.168.2.222:65501/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;