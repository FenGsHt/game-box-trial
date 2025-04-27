/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! 警告: 仅用于生产部署
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! 警告: 仅用于生产部署
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'upload.wikimedia.org',
      'cdn.akamai.steamstatic.com',
      'i.pravatar.cc'
    ],
  },
  // Next.js 15中的配置方式可能与文档不同，移除自定义超时配置
  experimental: {}
};

module.exports = nextConfig;
