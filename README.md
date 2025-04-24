# 游戏盒子 - 现代游戏平台应用

一个使用前沿技术栈构建的游戏平台 Web 应用，提供游戏发现、购买和社区互动功能。

## 技术栈

- **Next.js 14** - 带有 App Router 的 React 框架
- **TypeScript** - 静态类型检查
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Supabase** - 后端数据库和身份验证
- **React Query** - 数据获取和状态管理
- **Framer Motion** - 动画效果
- **Shadcn UI** - 可定制的 UI 组件库

## 主要功能

- 游戏发现和搜索
- 游戏详情页面
- 用户评论和评分
- 购物车和结账
- 用户认证（注册、登录）
- 游戏库管理
- 响应式设计（移动端、平板、桌面）

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── game/               # 游戏详情页
│   ├── store/              # 游戏商店页
│   ├── categories/         # 分类浏览页
│   └── ...                 
├── components/             # React 组件
│   ├── ui/                 # 基础 UI 组件
│   ├── game/               # 游戏相关组件
│   └── layout/             # 布局组件
├── lib/                    # 工具函数和共享逻辑
│   ├── supabase.ts         # Supabase 客户端
│   └── utils.ts            # 工具函数
└── ...
```

## 本地开发

1. 克隆仓库
```bash
git clone https://github.com/your-username/game-box.git
cd game-box
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
在项目根目录创建 `.env.local` 文件并添加：
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 启动开发服务器
```bash
npm run dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 部署

应用可以部署到 Vercel、Netlify 或其他支持 Next.js 的平台。

### Vercel 部署 (推荐)

[![部署到 Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/game-box)

## 路线图

- [ ] 实现用户身份验证
- [ ] 集成支付系统
- [ ] 添加游戏搜索功能
- [ ] 实现游戏评论系统
- [ ] 添加游戏推荐算法

## 贡献

欢迎贡献！请随意提交 issue 或 PR。
