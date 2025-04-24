import Image from "next/image";
import Link from "next/link";
import { GameCard } from "@/components/game/GameCard";
import { Button } from "@/components/ui/button";

// 模拟游戏数据
const featuredGames = [
  {
    id: "1",
    title: "赛博朋克2077",
    description: "一款开放世界动作冒险游戏",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
    category: "角色扮演",
    tags: ["开放世界", "科幻", "第一人称"],
    rating: 4.2,
    releaseDate: "2020-12-10",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    platform: ["PC", "PlayStation", "Xbox"],
    price: 298,
    created_at: "2023-01-01"
  },
  {
    id: "2",
    title: "原神",
    description: "开放世界冒险RPG",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_poster.jpg",
    category: "角色扮演",
    tags: ["开放世界", "奇幻", "动作"],
    rating: 4.5,
    releaseDate: "2020-09-28",
    developer: "米哈游",
    publisher: "米哈游",
    platform: ["PC", "PlayStation", "Mobile"],
    price: 0,
    created_at: "2023-01-02"
  },
  {
    id: "3",
    title: "艾尔登法环",
    description: "由宫崎英高打造的开放世界动作RPG",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
    category: "角色扮演",
    tags: ["开放世界", "黑暗奇幻", "动作"],
    rating: 4.8,
    releaseDate: "2022-02-25",
    developer: "FromSoftware",
    publisher: "万代南梦宫",
    platform: ["PC", "PlayStation", "Xbox"],
    price: 398,
    discountPrice: 298,
    created_at: "2023-01-03"
  },
  {
    id: "4",
    title: "我的世界",
    description: "一个关于方块与冒险的游戏",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
    category: "沙盒",
    tags: ["生存", "建造", "多人"],
    rating: 4.7,
    releaseDate: "2011-11-18",
    developer: "Mojang Studios",
    publisher: "Microsoft",
    platform: ["PC", "PlayStation", "Xbox", "Switch", "Mobile"],
    price: 165,
    created_at: "2023-01-04"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 英雄区域 */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg.jpg"
            alt="游戏背景"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">
              发现您的下一个游戏冒险
            </h1>
            <p className="text-xl mb-8">
              游戏盒子提供数千款游戏，从AAA大作到独立精品，总有一款适合您。
            </p>
            <div className="flex space-x-4">
              <Button size="lg" asChild>
                <Link href="/store">浏览游戏</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">加入社区</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 特色游戏 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">精选游戏</h2>
            <Link href="/store" className="text-blue-600 hover:underline">
              查看更多
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* 分类 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">按类别浏览</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "动作", icon: "🎯", color: "bg-red-100" },
              { name: "冒险", icon: "🗺️", color: "bg-green-100" },
              { name: "角色扮演", icon: "🧙", color: "bg-blue-100" },
              { name: "策略", icon: "♟️", color: "bg-yellow-100" },
              { name: "模拟", icon: "🚗", color: "bg-purple-100" },
              { name: "体育", icon: "⚽", color: "bg-orange-100" },
              { name: "赛车", icon: "🏎️", color: "bg-pink-100" },
              { name: "独立", icon: "🎮", color: "bg-indigo-100" },
              { name: "多人", icon: "👥", color: "bg-teal-100" },
              { name: "恐怖", icon: "👻", color: "bg-red-100" },
              { name: "沙盒", icon: "🏝️", color: "bg-blue-100" },
              { name: "音乐", icon: "🎵", color: "bg-purple-100" }
            ].map((category, index) => (
              <Link 
                key={index} 
                href={`/categories/${category.name}`}
                className={`${category.color} rounded-lg p-6 text-center hover:shadow-md transition-shadow flex flex-col items-center`}
              >
                <span className="text-3xl mb-2">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">获取最新游戏资讯和独家优惠</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            订阅我们的通讯，第一时间获取游戏发售信息、优惠活动和独家内容。
          </p>
          <div className="flex flex-col md:flex-row justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="您的邮箱地址"
              className="px-4 py-3 rounded-l md:rounded-r-none mb-2 md:mb-0 w-full text-gray-900 focus:outline-none"
            />
            <Button 
              size="lg" 
              className="md:rounded-l-none"
            >
              订阅
            </Button>
          </div>
        </div>
      </section>

      {/* 平台特性 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">为什么选择游戏盒子</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-blue-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">海量游戏库</h3>
              <p className="text-gray-600">
                数千款游戏任您选择，从大型AAA游戏到独立精品，应有尽有。
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">活跃社区</h3>
              <p className="text-gray-600">
                与全球玩家交流，分享游戏心得，组队游戏，结交志同道合的朋友。
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-purple-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">超值优惠</h3>
              <p className="text-gray-600">
                定期折扣活动，会员专属优惠，让您以最优惠的价格享受游戏乐趣。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
