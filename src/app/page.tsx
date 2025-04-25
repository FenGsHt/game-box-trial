"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

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
      {/* 其它首页内容可保留或精简 */}
    </div>
  );
}
