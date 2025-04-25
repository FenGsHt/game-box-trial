"use client"
import { GameCard } from "@/components/game/GameCard";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

// 搜索图标矢量组件
const SearchIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
)

// 模拟游戏数据
const allGames = [
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
    discountPrice: 149,
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
  },
  {
    id: "5",
    title: "英雄联盟",
    description: "多人在线战术竞技游戏",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/1200px-LoL_icon.svg.png",
    category: "多人竞技",
    tags: ["团队战斗", "策略", "多人"],
    rating: 4.3,
    releaseDate: "2009-10-27",
    developer: "Riot Games",
    publisher: "Riot Games",
    platform: ["PC"],
    price: 0,
    created_at: "2023-01-05"
  },
  {
    id: "6",
    title: "魔兽世界",
    description: "大型多人在线角色扮演游戏",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/65/World_of_Warcraft.png",
    category: "角色扮演",
    tags: ["MMORPG", "奇幻", "多人"],
    rating: 4.5,
    releaseDate: "2004-11-23",
    developer: "暴雪娱乐",
    publisher: "暴雪娱乐",
    platform: ["PC"],
    price: 98,
    discountPrice: 49,
    created_at: "2023-01-06"
  },
  {
    id: "7",
    title: "塞尔达传说：荒野之息",
    description: "开放世界冒险游戏",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    category: "冒险",
    tags: ["开放世界", "奇幻", "动作"],
    rating: 4.9,
    releaseDate: "2017-03-03",
    developer: "任天堂",
    publisher: "任天堂",
    platform: ["Switch"],
    price: 398,
    created_at: "2023-01-07"
  },
  {
    id: "8",
    title: "DOTA 2",
    description: "多人在线战斗竞技场",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/27/Dota_2_Screenshot.jpg",
    category: "多人竞技",
    tags: ["MOBA", "策略", "团队战斗"],
    rating: 4.6,
    releaseDate: "2013-07-09",
    developer: "Valve",
    publisher: "Valve",
    platform: ["PC"],
    price: 0,
    created_at: "2023-01-08"
  }
];

export default function StorePage() {
  const { t } = useTranslation();
  const categories = [
    t('all', '全部'),
    t('rpg', '角色扮演'),
    t('moba', '多人竞技'),
    t('sandbox', '沙盒'),
    t('adventure', '冒险'),
    t('strategy', '策略'),
    t('shooter', '射击'),
    t('sports', '体育'),
    t('racing', '赛车'),
  ];
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('store', '游戏商店')}</h1>
      
      {/* 过滤工具条 */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant={index === 0 ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-4">
            <select className="rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="relevance">{t('sort_relevance', '相关度')}</option>
              <option value="price_low">{t('sort_price_low', '价格: 低到高')}</option>
              <option value="price_high">{t('sort_price_high', '价格: 高到低')}</option>
              <option value="rating">{t('sort_rating', '评分: 高到低')}</option>
              <option value="release">{t('sort_release', '发行日期: 新到旧')}</option>
            </select>
            
            <div className="relative">
              <input 
                type="search" 
                placeholder={t('search_games', '搜索游戏...')} 
                className="rounded-md border border-gray-300 pl-10 pr-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>
      
      {/* 游戏列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      
      {/* 分页 */}
      <div className="flex justify-center mt-12">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            {t('prev', '上一页')}
          </Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="px-2">...</span>
          <Button variant="outline" size="sm">10</Button>
          <Button variant="outline" size="sm">
            {t('next', '下一页')}
          </Button>
        </nav>
      </div>
      
      {/* 订阅区域 */}
      <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('subscription_title', '不错过任何游戏优惠')}</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {t('subscription_desc', '订阅我们的通讯，获取独家折扣、新游戏发布通知和个性化推荐。')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder={t('your_email', '您的邮箱地址')}
            className="px-4 py-3 rounded-l-md sm:rounded-r-none mb-2 sm:mb-0 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button size="lg" className="sm:rounded-l-none">
            {t('subscribe', '订阅')}
          </Button>
        </div>
      </div>
    </div>
  );
} 