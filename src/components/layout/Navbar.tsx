"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
// 移除国际化
// import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/profileApi'

interface IconProps {
  className?: string;
}

// 矢量图标组件
const CartIcon = (props: IconProps) => (
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
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
    />
  </svg>
)

const MenuIcon = (props: IconProps) => (
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
      d="M4 6h16M4 12h16M4 18h16" 
    />
  </svg>
)

const CloseIcon = (props: IconProps) => (
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
      d="M6 18L18 6M6 6l12 12" 
    />
  </svg>
)

// 游戏盒子Logo图标
const GameBoxLogo = (props: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className}
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h18v8zM6 15h2v-2h2v-2H8V9H6v2H4v2h2z"/>
    <path d="M16 15h2v-2h2v-2h-2V9h-2v2h-2v2h2z"/>
  </svg>
)

// 待玩清单图标
const TodoListIcon = (props: IconProps) => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
    />
  </svg>
)

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // 移除国际化
  // const { t, i18n } = useTranslation();
  const [user, setUser] = useState<{email?: string} | null>(null);
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

  // 移除语言切换功能
  // const changeLanguage = (lng: string) => {
  //   i18n.changeLanguage(lng);
  // };

  return (
    <nav className="bg-white/90 backdrop-blur shadow-sm py-3 fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-1 group flex-shrink-0">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <GameBoxLogo className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight group-hover:text-blue-700 transition-colors select-none">GameBox</span>
        </Link>

        {/* 桌面导航 */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-4">
            <Link href="/todo-list" className="nav-link">待玩清单</Link>
            <Link href="/group-manager" className="nav-link">游戏组</Link>
          </div>
          <div className="flex items-center space-x-3 ml-6">
            <Link href="/todo-list" className="relative group flex-shrink-0">
              <TodoListIcon className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
            </Link>
            <Link href="/cart" className="relative group flex-shrink-0 ml-2 md:ml-0">
              <CartIcon className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">0</span>
            </Link>
            {!user ? (
              <Button variant="default" size="sm" asChild>
                <Link href="/signin">登录/注册</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm font-medium">
                  {profile?.username ? `${profile.username}（${user.email}）` : user.email}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">个人中心</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>退出</Button>
              </div>
            )}
            {/* 移除语言切换按钮
            <div className="ml-2 flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
              <button onClick={() => changeLanguage('zh')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">中</button>
              <span className="text-gray-400">|</span>
              <button onClick={() => changeLanguage('en')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">EN</button>
            </div>
            */}
          </div>
        </div>

        {/* 移动端登录按钮和菜单按钮同一行 */}
        <div className="flex items-center md:hidden space-x-2">
          {!user ? (
            <Button variant="default" size="sm" asChild>
              <Link href="/signin">登录/注册</Link>
            </Button>
          ) : (
            <span className="text-gray-700 text-sm font-medium">
              {profile?.username ? `${profile.username}（${user.email}）` : user.email}
            </span>
          )}
          <button 
            className="text-gray-600 ml-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <CloseIcon className="h-7 w-7" />
            ) : (
              <MenuIcon className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-white border-t">
          <div className="flex flex-col space-y-4">
            <Link href="/todo-list" className="nav-link py-2" onClick={toggleMenu}>待玩清单</Link>
            <Link href="/group-manager" className="nav-link py-2" onClick={toggleMenu}>游戏组</Link>
            <div className="flex items-center justify-between py-2">
              {!user ? (
                <Button variant="default" size="sm" asChild>
                  <Link href="/signin">登录/注册</Link>
                </Button>
              ) : (
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-700 text-sm font-medium">
                    {profile?.username ? `${profile.username}(${user.email})` : user.email}
                  </span>
                  <div className="flex gap-2 mt-5">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/profile">个人中心</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>退出</Button>
                  </div>
                </div>
              )}
              {/* 移除语言切换按钮
              <div className="ml-2 flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                <button onClick={() => changeLanguage('zh')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">中</button>
                <span className="text-gray-400">|</span>
                <button onClick={() => changeLanguage('en')} className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none">EN</button>
              </div>
              */}
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .nav-link {
          @apply text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-blue-50 active:bg-blue-100;
        }
      `}</style>
    </nav>
  )
} 