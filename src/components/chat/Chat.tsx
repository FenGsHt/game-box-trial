"use client"

import React, { useState } from 'react'
import { ChatButton } from './ChatButton'
import { ChatWindow } from './ChatWindow'

export function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  
  // 切换聊天窗口
  const toggleChat = () => {
    setIsOpen(prev => !prev)
  }
  
  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
} 