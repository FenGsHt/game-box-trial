"use client"

import React from 'react'
import { GameTodoList } from '@/components/game/GameTodoList'
// import { useTranslation } from 'react-i18next'

export default function TodoListPage() {
//   const { t } = useTranslation()
  
  return (
    <div className="container mx-auto px-4 py-4 mt-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">我的待玩游戏清单</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            {/* {t('todo_description', '在这里记录您想要体验的游戏，可以标记完成或删除。')} */}
            在这里记录您想要体验的游戏，可以标记完成或删除。
          </p>
        </div>
        
        <GameTodoList />
      </div>
    </div>
  )
} 