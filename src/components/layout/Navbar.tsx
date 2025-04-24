"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-sm py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <Image 
              src="/logo.svg" 
              alt="游戏盒子"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-blue-600">游戏盒子</span>
        </Link>

        {/* 桌面导航 */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              首页
            </Link>
            <Link href="/store" className="text-gray-700 hover:text-blue-600 transition-colors">
              商店
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
              分类
            </Link>
            <Link href="/library" className="text-gray-700 hover:text-blue-600 transition-colors">
              我的游戏库
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-blue-600 transition-colors">
              社区
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <div className="relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors"
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
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </Link>
            <Button variant="default" size="sm" asChild>
              <Link href="/signin">登录</Link>
            </Button>
          </div>
        </div>

        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden text-gray-600"
          onClick={toggleMenu}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
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
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              首页
            </Link>
            <Link 
              href="/store" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              商店
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              分类
            </Link>
            <Link 
              href="/library" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              我的游戏库
            </Link>
            <Link 
              href="/community" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              社区
            </Link>
            <div className="flex items-center justify-between py-2">
              <Link
                href="/cart"
                onClick={toggleMenu}
                className="flex items-center space-x-2 text-gray-700"
              >
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
                <span>购物车</span>
              </Link>
              <Button variant="default" size="sm" asChild>
                <Link href="/signin" onClick={toggleMenu}>登录</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 