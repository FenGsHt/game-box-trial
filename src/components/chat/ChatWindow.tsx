"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'

// 聊天消息类型
interface ChatMessage {
  id: string
  content: string
  sender_id: string
  sender_name: string
  created_at: string
}

// 用户类型
interface User {
  id?: string;
  email?: string;
}

// 聊天窗口组件属性
interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

// 消息发送图标
const SendIcon = (props: { className?: string }) => (
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
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

// 关闭图标
const CloseIcon = (props: { className?: string }) => (
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
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 模拟初始消息
  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      content: t('welcome_message', '欢迎来到游戏盒子聊天室！有什么可以帮助您的吗？'),
      sender_id: 'system',
      sender_name: t('system', '系统'),
      created_at: new Date().toISOString()
    }
  ]

  // 获取用户信息
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // 加载初始消息
  useEffect(() => {
    setMessages(initialMessages)
    
    // 这里可以从数据库加载历史消息
    // 实际项目中应该从后端API获取消息历史
  }, [])

  // 滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 发送消息
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    // 创建新消息
    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user?.id || 'guest',
      sender_name: user?.email?.split('@')[0] || t('guest', '访客'),
      created_at: new Date().toISOString()
    }
    
    // 添加到消息列表
    setMessages([...messages, message])
    
    // 清空输入框
    setNewMessage('')
    
    // 这里可以添加将消息发送到服务器的代码
    // 例如: supabase.from('messages').insert([message])
  }

  // 如果窗口关闭则不渲染
  if (!isOpen) return null

  return (
    <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col z-50 max-h-[70vh] border border-gray-200">
      {/* 聊天窗口头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-medium">{t('chat_title', '游戏盒子聊天')}</h3>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white focus:outline-none"
          aria-label={t('close', '关闭')}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* 消息区域 */}
      <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`mb-3 max-w-[85%] ${msg.sender_id === (user?.id || 'guest') ? 'ml-auto' : ''}`}
          >
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-gray-500">
                {msg.sender_id === (user?.id || 'guest') ? t('you', '你') : msg.sender_name}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div 
              className={`p-3 rounded-lg ${
                msg.sender_id === (user?.id || 'guest') 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('type_message', '输入消息...')}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button 
          type="submit" 
          className="rounded-l-none bg-blue-600 hover:bg-blue-700"
          disabled={!newMessage.trim()}
        >
          <SendIcon className="w-5 h-5" />
        </Button>
      </form>
    </div>
  )
} 