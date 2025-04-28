"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
// 移除国际化
// import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/profileApi'
import { useNotifications } from '@/lib/NotificationContext'

// 定义Profile接口
interface Profile {
  username?: string;
  email?: string;
  id?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  // 使用索引签名但限制为string类型
  [key: string]: string | undefined;
}

interface IconProps {
  className?: string;
}

// 自定义图标组件
const HomeIcon = (props: IconProps) => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2" 
    />
  </svg>
)

const BookmarkSquareIcon = (props: IconProps) => (
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
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
    />
  </svg>
)

const UsersIcon = (props: IconProps) => (
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
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
    />
  </svg>
)

const UserCircleIcon = (props: IconProps) => (
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
      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
)

const ArrowRightOnRectangleIcon = (props: IconProps) => (
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
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
    />
  </svg>
)

const UserPlusIcon = (props: IconProps) => (
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
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
    />
  </svg>
)

const UserIcon = (props: IconProps) => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
    />
  </svg>
)

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
  const [profile, setProfile] = useState<Profile | null>(null);
  // 使用通知上下文
  const { unreadTodos, markTodosAsRead } = useNotifications();

  // 添加点击外部关闭菜单的处理程序
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 检查点击目标是否是菜单或菜单按钮的子元素
      if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    // 添加全局点击事件监听器
    document.addEventListener('click', handleOutsideClick);
    
    // 清除监听器
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMenuOpen]);

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
            <Link href="/todo-list" 
              className="nav-link"
              onClick={() => markTodosAsRead()}>待玩清单</Link>
            <Link href="/group-manager" className="nav-link">游戏组</Link>
          </div>
          <div className="flex items-center space-x-3 ml-6">
            <Link href="/todo-list" 
              className="relative group flex-shrink-0"
              onClick={() => markTodosAsRead()}>
              <TodoListIcon className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
              {unreadTodos > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 h-3 w-3 rounded-full border border-white animate-pulse"></span>
              )}
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
                <span className="text-gray-700 text-sm font-medium relative">
                  {profile?.username ? `${profile.username}（${user.email}）` : user.email}
                  {unreadTodos > 0 && (
                    <span className="absolute top-0 -right-2 bg-red-500 h-2 w-2 rounded-full"></span>
                  )}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">个人中心</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>退出</Button>
              </div>
            )}
          </div>
        </div>

        {/* 移动端菜单按钮 */}
        <div className="md:hidden flex items-center">
          {user && (
            <div className="flex items-center mr-3">
              <Link href="/todo-list" 
                className="relative mr-3"
                onClick={() => markTodosAsRead()}>
                <TodoListIcon className="h-5 w-5 text-gray-600" />
                {unreadTodos > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 h-2 w-2 rounded-full"></span>
                )}
              </Link>
              <Link href="/profile" className="relative">
                <UserCircleIcon className="h-5 w-5 text-gray-600" />
                {profile && (
                  <span className="absolute bottom-0 right-0 bg-green-500 h-2 w-2 rounded-full border border-white"></span>
                )}
              </Link>
            </div>
          )}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-600 focus:outline-none menu-button"
            aria-label="菜单"
          >
            {isMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 bg-white shadow-lg border-t border-gray-100">
            <Link href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}>
              <HomeIcon className="h-5 w-5 text-blue-600" />
              <span>首页</span>
            </Link>
            <Link href="/todo-list" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => {
                setIsMenuOpen(false);
                markTodosAsRead();
              }}>
              <BookmarkSquareIcon className="h-5 w-5 text-blue-600" />
              <span className="relative">
                待玩清单
                {unreadTodos > 0 && (
                  <span className="absolute top-0 -right-2 bg-red-500 h-2 w-2 rounded-full"></span>
                )}
              </span>
            </Link>
            <Link href="/group-manager" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}>
              <UsersIcon className="h-5 w-5 text-blue-600" />
              <span>游戏组</span>
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* 用户认证区域 */}
            {!user ? (
              <>
                <Link href="/signin" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  <span>登录</span>
                </Link>
                <Link href="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}>
                  <UserPlusIcon className="h-5 w-5 text-blue-600" />
                  <span>注册</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}>
                  <UserCircleIcon className="h-5 w-5 text-blue-600" />
                  <span>个人中心</span>
                </Link>
                <button
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}>
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-blue-600" />
                  <span>退出</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 