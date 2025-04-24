/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'upload.wikimedia.org',
      'cdn.akamai.steamstatic.com',
      'i.pravatar.cc'
      // 你用到的其他图片域名也可以加在这里
    ],
  },
}
export default nextConfig;
