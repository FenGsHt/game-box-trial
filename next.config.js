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
      'i.pravatar.cc',
      'shared.fastly.steamstatic.com',
      'placehold.co'
    ],
  },
  // Next.js 15中的配置方式可能与文档不同，移除自定义超时配置
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  // 增加API路由超时设置
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '1mb',
    },
    externalResolver: true,
  },
  // 增加HTTP头部设置，支持跨域请求
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
