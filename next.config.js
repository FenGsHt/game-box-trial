
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
};

module.exports = nextConfig;
