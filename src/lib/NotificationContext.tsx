"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { getUnreadTodosCount, markTodosAsViewed } from './todoApi';

interface NotificationContextType {
  unreadTodos: number;
  markTodosAsRead: () => Promise<void>;
  updateNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadTodos: 0,
  markTodosAsRead: async () => {},
  updateNotifications: async () => {},
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

  // 获取未读通知（未评分的组内游戏）
  const fetchUnreadTodos = async () => {
    const count = await getUnreadTodosCount();
    setUnreadTodos(count);
  };

  // 监听未读通知状态
  useEffect(() => {
    if (!user) return;
    
    fetchUnreadTodos();
    
    // 设置定时器，每分钟检查一次未评分的游戏
    const intervalId = setInterval(fetchUnreadTodos, 60000);
    
    // 订阅游戏评分的实时更新
    const ratingsSubscription = supabase
      .channel('public:game_ratings')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_ratings' 
        }, 
        () => {
          fetchUnreadTodos();
        }
      )
      .subscribe();
    
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
      ratingsSubscription.unsubscribe();
      todoSubscription.unsubscribe();
    };
  }, [user]);

  // 标记待玩游戏为已读（现在这个函数仅仅是刷新通知状态）
  const markTodosAsRead = async () => {
    await markTodosAsViewed(); // 这个函数现在是空函数
    await fetchUnreadTodos(); // 重新获取未评分游戏数量
  };

  // 更新通知状态（用于用户评分后刷新通知）
  const updateNotifications = async () => {
    await fetchUnreadTodos();
  };

  return (
    <NotificationContext.Provider value={{ unreadTodos, markTodosAsRead, updateNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
} 