"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'

// 待玩游戏项类型
export interface GameTodo {
  id: string
  title: string
  is_completed: boolean
  user_id: string
  rating?: number  // 游戏评分，1-5分，支持半星
  created_at: string
}

// 添加图标
const PlusIcon = (props: { className?: string }) => (
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
      d="M12 4v16m8-8H4" 
    />
  </svg>
)

// 删除图标
const TrashIcon = (props: { className?: string }) => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </svg>
)

// 星星图标 - 实心
const StarFilledIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z" />
  </svg>
)

// 星星图标 - 空心
const StarEmptyIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z" />
  </svg>
)

// 星星图标 - 半星
const StarHalfIcon = (props: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={props.className} 
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path 
      fill="url(#halfStar)" 
      stroke="currentColor" 
      strokeWidth="1"
      d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z" 
    />
  </svg>
)

// 评分选择组件
const RatingStars = ({ 
  rating, 
  onChange, 
  readOnly = false,
  size = 'md'
}: { 
  rating?: number; 
  onChange?: (rating: number) => void; 
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  // 根据大小设置星星尺寸
  const starSizeClass = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size];
  
  // 渲染星星
  const renderStar = (value: number) => {
    const isHalfStar = value % 1 !== 0;
    const starValue = isHalfStar ? Math.floor(value) + 0.5 : value;
    const isFilled = (rating || 0) >= starValue;
    const isHalf = isHalfStar && (rating || 0) >= value && (rating || 0) < Math.ceil(value);
    
    if (isHalf) {
      return <StarHalfIcon className={`${starSizeClass} text-yellow-500`} />;
    }
    
    return isFilled ? 
      <StarFilledIcon className={`${starSizeClass} text-yellow-500`} /> :
      <StarEmptyIcon className={`${starSizeClass} text-gray-300`} />;
  };
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <div 
          key={star} 
          className={`relative ${readOnly ? '' : 'cursor-pointer'}`}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          {/* 整星 */}
          <div>
            {renderStar(star)}
          </div>
          
          {/* 半星选择区域 - 只有在非只读模式下显示 */}
          {!readOnly && (
            <div 
              className="absolute top-0 left-0 w-1/2 h-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) {
                  onChange(star - 0.5);
                }
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export function GameTodoList() {
  const { t } = useTranslation()
  const [todos, setTodos] = useState<GameTodo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id?: string } | null>(null)

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

  // 加载待玩游戏列表
  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchTodos = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('game_todos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('获取待玩游戏列表失败:', error)
          return
        }
        
        setTodos(data || [])
      } catch (error) {
        console.error('获取待玩游戏列表异常:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()

    // 设置实时订阅
    const subscription = supabase
      .channel('game_todos_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_todos',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTodos(current => [payload.new as GameTodo, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setTodos(current => 
              current.map(todo => 
                todo.id === payload.new.id ? (payload.new as GameTodo) : todo
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTodos(current => 
              current.filter(todo => todo.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id])

  // 添加待玩游戏
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTodo.trim() || !user?.id) return
    
    try {
      const newTodoItem = {
        title: newTodo.trim(),
        is_completed: false,
        rating: 0, // 默认评分为0
        user_id: user.id
      }
      
      const { error } = await supabase
        .from('game_todos')
        .insert([newTodoItem])
      
      if (error) {
        console.error('添加待玩游戏失败:', error)
        return
      }
      
      setNewTodo('')
    } catch (error) {
      console.error('添加待玩游戏异常:', error)
    }
  }

  // 切换完成状态
  const toggleTodo = async (id: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('game_todos')
        .update({ is_completed: !isCompleted })
        .eq('id', id)
        .eq('user_id', user?.id)
      
      if (error) {
        console.error('更新待玩游戏状态失败:', error)
      }
    } catch (error) {
      console.error('更新待玩游戏状态异常:', error)
    }
  }

  // 更新游戏评分
  const updateRating = async (id: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('game_todos')
        .update({ rating })
        .eq('id', id)
        .eq('user_id', user?.id)
      
      if (error) {
        console.error('更新游戏评分失败:', error)
      }
    } catch (error) {
      console.error('更新游戏评分异常:', error)
    }
  }

  // 删除待玩游戏
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('game_todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)
      
      if (error) {
        console.error('删除待玩游戏失败:', error)
      }
    } catch (error) {
      console.error('删除待玩游戏异常:', error)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">{t('todo_login_required', '请登录后查看您的待玩游戏清单')}</p>
        <Button asChild>
          <a href="/signin">{t('signin', '登录')}</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">{t('todo_list_title', '待玩游戏清单')}</h2>
      
      <form onSubmit={addTodo} className="flex mb-6 gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder={t('todo_add_placeholder', '添加待玩的游戏...')}
          className="flex-1"
        />
        <Button type="submit" disabled={!newTodo.trim()}>
          <PlusIcon className="h-5 w-5" />
        </Button>
      </form>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('todo_empty', '您的待玩游戏清单为空，添加一些游戏吧！')}
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo.id} className="flex flex-col border-b pb-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={`todo-${todo.id}`}
                    checked={todo.is_completed}
                    onCheckedChange={() => toggleTodo(todo.id, todo.is_completed)}
                  />
                  <label 
                    htmlFor={`todo-${todo.id}`}
                    className={`${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                  >
                    {todo.title}
                  </label>
                </div>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={t('todo_delete', '删除')}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="ml-7 mt-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{t('rating', '评分')}:</span>
                  <RatingStars 
                    rating={todo.rating} 
                    onChange={(newRating) => updateRating(todo.id, newRating)}
                    size="sm"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 