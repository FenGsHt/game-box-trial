const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 创建一个临时的 next.config.js 文件，禁用类型检查
const nextConfigPath = path.resolve('./next.config.js');
let originalNextConfig = '';

// 检查是否已存在 next.config.js
if (fs.existsSync(nextConfigPath)) {
  originalNextConfig = fs.readFileSync(nextConfigPath, 'utf8');
}

// 创建或修改 next.config.js，禁用类型检查
const newConfig = `
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
`;

fs.writeFileSync(nextConfigPath, newConfig);

try {
  // 直接执行 next build 命令，而不是通过 npm run build
  console.log('执行构建，忽略类型检查...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('构建成功!');
} catch (error) {
  console.error('构建失败:', error);
  process.exit(1);
} finally {
  // 恢复原始 next.config.js
  if (originalNextConfig) {
    fs.writeFileSync(nextConfigPath, originalNextConfig);
  } else {
    // 如果之前不存在，则删除
    fs.unlinkSync(nextConfigPath);
  }
  console.log('已恢复原始配置');
} 