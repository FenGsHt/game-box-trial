"use client"

import React from 'react'
// import { useTranslation } from 'react-i18next'

// 聊天图标
const ChatIcon = (props: { className?: string }) => (
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
    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
  </svg>
)

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  // const { t } = useTranslation()
  
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600 rotate-90'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
      aria-label={isOpen ? '关闭聊天' : '打开聊天'}
    >
      <ChatIcon className="w-7 h-7 text-white" />
      <span className="sr-only">
        {isOpen ? '关闭聊天' : '打开聊天'}
      </span>
    </button>
  )
} 