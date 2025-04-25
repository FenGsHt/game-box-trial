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
        {/* <div className="absolute inset-0 z-0">
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
        </div> */}
      </section>

    
      
      {/* 可以根据需要添加更多内容 */}
    </div>
  );
}
