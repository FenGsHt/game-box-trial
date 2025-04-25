"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

// 特性图标组件
const ControllerIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 12h4" />
    <path d="M8 10v4" />
    <circle cx="17" cy="10" r="1" />
    <circle cx="15" cy="13" r="1" />
  </svg>
)

const CollectionIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
    <path d="M14 15h4" />
  </svg>
)

const CommunityIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const SaleIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z" />
    <path d="M6 9.01V9" />
    <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
  </svg>
)

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      {/* 英雄区域 */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg.jpg"
            alt={t('hero_bg', '游戏背景')}
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">
              {t('discover_next_adventure', '发现您的下一个游戏冒险')}
            </h1>
            <p className="text-xl mb-8">
              {t('hero_desc', '游戏盒子提供数千款游戏，从AAA大作到独立精品，总有一款适合您。')}
            </p>
            <div className="flex space-x-8">
              <Button size="lg" asChild>
                <Link href="/store">{t('browse_games', '浏览游戏')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 特性区域 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('why_gamebox', '为什么选择GameBox')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 特性1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg mb-4">
                <ControllerIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('feature_games', '海量游戏')}</h3>
              <p className="text-gray-600">{t('feature_games_desc', '超过10000款游戏，横跨各种类型和平台')}</p>
            </div>
            
            {/* 特性2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-lg mb-4">
                <CollectionIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('feature_collection', '个人收藏')}</h3>
              <p className="text-gray-600">{t('feature_collection_desc', '管理您的游戏库，追踪您的成就和游戏时间')}</p>
            </div>
            
            {/* 特性3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg mb-4">
                <CommunityIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('feature_community', '活跃社区')}</h3>
              <p className="text-gray-600">{t('feature_community_desc', '与其他游戏玩家互动，分享心得和体验')}</p>
            </div>
            
            {/* 特性4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-red-100 text-red-600 rounded-lg mb-4">
                <SaleIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('feature_deals', '限时优惠')}</h3>
              <p className="text-gray-600">{t('feature_deals_desc', '定期促销和独家折扣，帮您省钱')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 可以根据需要添加更多内容 */}
    </div>
  );
}
