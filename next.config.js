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
  // 增加构建超时时间（单位：秒）
  experimental: {
    staticPageGenerationTimeout: 180
  }
};

module.exports = nextConfig;
