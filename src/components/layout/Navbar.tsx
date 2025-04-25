"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/profileApi'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ username?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
    getProfile().then(setProfile);
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      getProfile().then(setProfile);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-white/90 backdrop-blur shadow-sm py-3 fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-1 group flex-shrink-0">
          <div className="relative w-9 h-9">
            <Image 
              src="/logo.svg" 
              alt={t('home')}
              fill
              className="object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight group-hover:text-blue-700 transition-colors select-none">GameBox</span>
        </Link>

        {/* 桌面导航 */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-4">
            <Link href="/" className="nav-link">{t('home')}</Link>
            <Link href="/store" className="nav-link">{t('store')}</Link>
            <Link href="/categories" className="nav-link">{t('categories')}</Link>
            <Link href="/library" className="nav-link">{t('games')}</Link>
            <Link href="/community" className="nav-link">{t('community')}</Link>
          </div>
          <div className="flex items-center space-x-3 ml-6">
            <Link href="/cart" className="relative group flex-shrink-0 ml-2 md:ml-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">0</span>
            </Link>
            {!user ? (
              <Button variant="default" size="sm" asChild>
                <Link href="/signin">{t('login')}/{t('register')}</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm font-medium">
                  {profile?.username ? `${profile.username}（${user.email}）` : user.email}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">个人中心</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>{t('logout')}</Button>
              </div>
            )}
            <div className="ml-2 flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
              <button onClick={() => changeLanguage('zh')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">中</button>
              <span className="text-gray-400">|</span>
              <button onClick={() => changeLanguage('en')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">EN</button>
            </div>
          </div>
        </div>

        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden text-gray-600 ml-2"
          onClick={toggleMenu}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-7 w-7" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-white border-t">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="nav-link py-2" onClick={toggleMenu}>{t('home')}</Link>
            <Link href="/store" className="nav-link py-2" onClick={toggleMenu}>{t('store')}</Link>
            <Link href="/categories" className="nav-link py-2" onClick={toggleMenu}>{t('categories')}</Link>
            <Link href="/library" className="nav-link py-2" onClick={toggleMenu}>{t('games')}</Link>
            <Link href="/community" className="nav-link py-2" onClick={toggleMenu}>{t('community')}</Link>
            <div className="flex items-center justify-between py-2">
              <Link href="/cart" onClick={toggleMenu} className="flex items-center space-x-2 text-gray-700">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                <span>{t('cart')}</span>
              </Link>
              {!user ? (
                <Button variant="default" size="sm" asChild>
                  <Link href="/signin">{t('login')}/{t('register')}</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 text-sm font-medium">
                    {profile?.username ? `${profile.username}(${user.email})` : user.email}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile">个人中心</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>{t('logout')}</Button>
                </div>
              )}
              <div className="ml-2 flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                <button onClick={() => changeLanguage('zh')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">中</button>
                <span className="text-gray-400">|</span>
                <button onClick={() => changeLanguage('en')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">EN</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .nav-link {
          @apply text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-blue-50 active:bg-blue-100;
        }
        .nav-link[aria-current="page"] {
          @apply text-blue-700 font-bold;
        }
      `}</style>
    </nav>
  )
} 