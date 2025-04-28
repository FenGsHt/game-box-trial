"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { getUnreadTodosCount, markTodosAsViewed } from './todoApi';

interface NotificationContextType {
  unreadTodos: number;
  markTodosAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadTodos: 0,
  markTodosAsRead: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadTodos, setUnreadTodos] = useState<number>(0);
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(null);

  // 监听用户状态
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  // 获取未读待玩游戏数量
  useEffect(() => {
    if (!user) return;
    
    const fetchUnreadTodos = async () => {
      const count = await getUnreadTodosCount();
      setUnreadTodos(count);
    };
    
    fetchUnreadTodos();
    
    // 设置定时器，每分钟检查一次未读待玩游戏
    const intervalId = setInterval(fetchUnreadTodos, 60000);
    
    // 订阅待玩游戏的实时更新
    const todoSubscription = supabase
      .channel('public:game_todos')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'game_todos' 
        }, 
        () => {
          fetchUnreadTodos();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(intervalId);
      todoSubscription.unsubscribe();
    };
  }, [user]);

  // 标记所有待玩游戏为已读
  const markTodosAsRead = async () => {
    await markTodosAsViewed();
    setUnreadTodos(0);
  };

  return (
    <NotificationContext.Provider value={{ unreadTodos, markTodosAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
} 