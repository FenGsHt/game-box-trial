import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

// 模拟游戏数据
const gameDetails = {
  id: "1",
  title: "赛博朋克2077",
  description: "《赛博朋克2077》是由CD PROJEKT RED开发的一款开放世界动作冒险RPG游戏，背景设定在夜之城，一个充满权力、魅力和身体改造沉迷的巨型都市。你扮演一位网络雇佣兵——V，正在追寻一种独特的植入物，这是获得永生的关键。您可以自定义角色的赛博装备、技能组和游戏风格，探索一个由机会、选择和影响力决定的巨大城市。您的所作所为将会塑造情节和您周围的世界。传说就从这里开始。",
  imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
  bannerUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
  screenshots: [
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_b529b0abc43f55fc0282cd7731d2d1d6c4b21e63.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_7a2a5e1c0fa590c7a3d6d6ac5b5574ae9e3bf2a7.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_3e67b58af6462cc5693ac5d0dfdcdf7441d24b8d.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_dc055e165341549f1b87dd0ff9f127913c143d11.jpg"
  ],
  category: "角色扮演",
  tags: ["开放世界", "科幻", "第一人称", "RPG", "未来", "故事丰富", "赛博朋克", "动作"],
  rating: 4.2,
  releaseDate: "2020-12-10",
  developer: "CD Projekt Red",
  publisher: "CD Projekt",
  platform: ["PC", "PlayStation", "Xbox"],
  price: 298,
  discountPrice: 149,
  systemRequirements: {
    minimum: {
      os: "Windows 10",
      cpu: "Intel Core i5-3570K 或 AMD FX-8310",
      ram: "8 GB",
      gpu: "NVIDIA GeForce GTX 970 或 AMD Radeon RX 470",
      storage: "70 GB 可用空间"
    },
    recommended: {
      os: "Windows 10",
      cpu: "Intel Core i7-4790 或 AMD Ryzen 3 3200G",
      ram: "12 GB",
      gpu: "NVIDIA GeForce GTX 1060 6GB 或 AMD Radeon RX 590",
      storage: "70 GB SSD"
    }
  },
  features: ["单人游戏", "成就", "全控制器支持", "云存档"],
  created_at: "2023-01-01"
};

// 模拟评论数据
const reviews = [
  {
    id: "1",
    user: {
      name: "玩家123",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    rating: 5,
    date: "2023-05-15",
    content: "这是我玩过的最好的游戏之一。尽管发布时有些问题，但现在已经修复了大部分bug，游戏体验非常流畅。故事情节扣人心弦，夜之城的设计令人惊叹。"
  },
  {
    id: "2",
    user: {
      name: "游戏爱好者",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    rating: 4,
    date: "2023-04-22",
    content: "画面和音乐都很棒，剧情也很吸引人。游戏性上还有一些小问题，但总体来说是一款很好的RPG。"
  },
  {
    id: "3",
    user: {
      name: "科幻迷",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    rating: 4,
    date: "2023-03-10",
    content: "作为一个赛博朋克设定的爱好者，这款游戏的世界观设计非常符合我的期待。夜之城的氛围营造得很到位，各种细节都很用心。"
  }
];

export default async function GamePage({ params }: { params: { id: string } }): Promise<React.ReactElement> {
  // 实际项目中，应该根据 ID 从后端获取游戏数据
  const game = gameDetails;
  
  // 只需加这一行即可
  console.log(params.id);

  // 计算折扣百分比
  const discountPercentage = game.discountPrice 
    ? Math.round(((game.price - game.discountPrice) / game.price) * 100) 
    : 0;

  return (
    <div className="pb-16">
      {/* 游戏横幅 */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <Image
          src={game.bannerUrl}
          alt={game.title}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container mx-auto px-4 relative h-full flex items-end pb-8">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{game.title}</h1>
            <p className="text-lg opacity-90">由 {game.developer} 开发 · {game.publisher} 发行</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：游戏信息和截图 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 游戏描述 */}
            <div>
              <h2 className="text-2xl font-bold mb-4">游戏简介</h2>
              <p className="text-gray-700 leading-relaxed">{game.description}</p>
            </div>

            {/* 游戏截图 */}
            <div>
              <h2 className="text-2xl font-bold mb-4">游戏截图</h2>
              <div className="grid grid-cols-2 gap-4">
                {game.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={screenshot}
                      alt={`${game.title} 截图 ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 系统需求 */}
            <div>
              <h2 className="text-2xl font-bold mb-4">系统需求</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">最低配置</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><span className="font-medium">操作系统：</span>{game.systemRequirements.minimum.os}</li>
                    <li><span className="font-medium">处理器：</span>{game.systemRequirements.minimum.cpu}</li>
                    <li><span className="font-medium">内存：</span>{game.systemRequirements.minimum.ram}</li>
                    <li><span className="font-medium">显卡：</span>{game.systemRequirements.minimum.gpu}</li>
                    <li><span className="font-medium">存储空间：</span>{game.systemRequirements.minimum.storage}</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">推荐配置</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><span className="font-medium">操作系统：</span>{game.systemRequirements.recommended.os}</li>
                    <li><span className="font-medium">处理器：</span>{game.systemRequirements.recommended.cpu}</li>
                    <li><span className="font-medium">内存：</span>{game.systemRequirements.recommended.ram}</li>
                    <li><span className="font-medium">显卡：</span>{game.systemRequirements.recommended.gpu}</li>
                    <li><span className="font-medium">存储空间：</span>{game.systemRequirements.recommended.storage}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 评论 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">用户评论</h2>
                <Button variant="outline" asChild>
                  <Link href={`/game/${game.id}/reviews`}>查看全部</Link>
                </Button>
              </div>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-start">
                      <Image
                        src={review.user.avatar}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium mr-2">{review.user.name}</span>
                          <div className="flex items-center bg-blue-100 px-2 py-0.5 rounded text-xs">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-3 w-3 text-yellow-500 mr-1" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z" />
                            </svg>
                            <span>{review.rating}.0</span>
                          </div>
                          <span className="text-gray-500 text-xs ml-2">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：购买信息 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    {game.discountPrice ? (
                      <>
                        <div className="flex items-center mb-1">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mr-2">
                            -{discountPercentage}%
                          </span>
                          <span className="text-gray-500 line-through text-sm">¥{game.price}</span>
                        </div>
                        <span className="text-2xl font-bold text-red-500">¥{game.discountPrice}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">¥{game.price}</span>
                    )}
                  </div>
                  <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-yellow-500 mr-1" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z" />
                    </svg>
                    <span className="text-sm font-medium">{game.rating}</span>
                  </div>
                </div>
                <Button className="w-full mb-2">加入购物车</Button>
                <Button variant="outline" className="w-full">添加到愿望清单</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="font-semibold text-lg">游戏信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">发行日期：</span>
                  <span>{formatDate(new Date(game.releaseDate))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">开发商：</span>
                  <span>{game.developer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">发行商：</span>
                  <span>{game.publisher}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-2">平台：</span>
                  <div className="flex space-x-2">
                    {game.platform.map((p) => (
                      <span key={p} className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">游戏标签</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/tags/${tag}`}
                    className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">游戏功能</h3>
              <div className="space-y-2">
                {game.features.map((feature) => (
                  <div key={feature} className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 