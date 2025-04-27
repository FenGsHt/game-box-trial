"use client"
import Link from "next/link";
// 移除国际化依赖
// import { useTranslation } from 'react-i18next';

// 游戏组图标
const GroupIcon = (props: { className?: string }) => (
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
    <path d="M3 7V5c0-1.1.9-2 2-2h2" />
    <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
    <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
    <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
    <path d="M8 7v10" />
    <path d="M16 7v10" />
    <path d="M7 12h10" />
  </svg>
)

// 待玩清单图标
const TodoListIcon = (props: { className?: string }) => (
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
    <path d="m8 6 4-4 4 4" />
    <path d="M12 2v10.3" />
    <rect width="12" height="8" x="6" y="14" rx="2" />
  </svg>
)

export default function Home() {
  // 使用静态文本替代国际化
  // const { t } = useTranslation();
  
  return (
    <div className="flex flex-col">
      {/* 游戏组和待玩清单卡片区域 */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">游戏管理</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            管理您的游戏组与待玩清单，与好友一起规划您的游戏之旅
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 游戏组卡片 */}
            <Link 
              href="/group-manager" 
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90"></div>
              <div className="relative p-8 h-full flex flex-col justify-between z-10">
                <div>
                  {/* <div className="bg-white bg-opacity-20 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                    <GroupIcon className="h-8 w-8 text-white" />
                  </div> */}
                  <h3 className="text-2xl font-bold text-white mb-2">游戏组</h3>
                  <p className="text-white text-opacity-90">
                    创建和管理您的游戏组，邀请好友共同游玩
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <span className="text-white font-medium group-hover:underline">
                    管理我的游戏组
                  </span>
                  <svg className="w-5 h-5 text-white ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                
                {/* 装饰性圆形 */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-indigo-700 bg-opacity-30"></div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-400 bg-opacity-20"></div>
              </div>
            </Link>
            
            {/* 待玩清单卡片 */}
            <Link 
              href="/todolist" 
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-90"></div>
              <div className="relative p-8 h-full flex flex-col justify-between z-10">
                <div>
                  {/* <div className="bg-white bg-opacity-20 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                    <TodoListIcon className="h-8 w-8 text-white" />
                  </div> */}
                  <h3 className="text-2xl font-bold text-white mb-2">待玩清单</h3>
                  <p className="text-white text-opacity-90">
                    管理您想要玩的游戏，记录评分和游戏体验
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <span className="text-white font-medium group-hover:underline">
                    查看我的待玩清单
                  </span>
                  <svg className="w-5 h-5 text-white ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                
                {/* 装饰性圆形 */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-orange-700 bg-opacity-30"></div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-400 bg-opacity-20"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
