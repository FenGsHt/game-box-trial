"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
// import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { GameGroup, getUserCreatedGroups, getUserJoinedGroups } from '@/lib/gameGroupApi'
import { useNotifications } from '@/lib/NotificationContext'

// 待玩游戏项类型
export interface GameTodo {
  id: string
  title: string
  is_completed: boolean
  avg_rating?: number  // 平均评分，1-5分，支持半星
  user_id: string
  group_id?: string // 所属游戏组ID
  created_at: string
  link?: string // 游戏链接
  note?: string // 游戏留言
  price?: number // 游戏价格
  tags?: string[] // 游戏标签ID列表
}

// 游戏留言类型
export interface GameComment {
  id: string
  game_todo_id: string
  user_id: string
  content: string
  created_at: string
  user_email?: string
  user_username?: string
  user_profile_name?: string  // 添加从profiles表获取的名称
}

// 游戏标签类型
export interface GameTag {
  id: string
  name: string    // 标签名称
  color: string   // 标签颜色
  created_at: string
  creator_id?: string // 创建者ID
}

// 游戏评分类型
export interface GameRating {
  id: string
  game_todo_id: string
  user_id: string
  rating: number
  rated_at: string
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
    filter="drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1))"
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
    strokeWidth="1.5"
    filter="drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.05))"
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
    filter="drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1))"
  >
    <defs>
      <clipPath id="leftHalf">
        <rect x="0" y="0" width="12" height="24" />
      </clipPath>
    </defs>
    <path 
      d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      className="text-gray-300"
    />
    <path 
      d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z"
      fill="currentColor"
      clipPath="url(#leftHalf)"
      className="text-amber-500"
    />
  </svg>
)

// 搜索图标
const SearchIcon = (props: { className?: string }) => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
)

// 排序图标
const SortIcon = (props: { className?: string }) => (
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
      d="M3 4h13M3 8h9M3 12h9M3 16h9M3 20h9m6-16l4 4m0 0l4-4m-4 4v16" 
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
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size];
  
  // 渲染星星
  const renderStar = (value: number) => {
    const currentRating = rating || 0;
    
    // 完全填充
    if (currentRating >= value) {
      return <StarFilledIcon className={`${starSizeClass} text-amber-500`} />;
    }
    
    // 半星（当评分值位于整数和整数+0.5之间时）
    if (currentRating >= value - 0.5 && currentRating < value) {
      return <StarHalfIcon className={`${starSizeClass} text-amber-500`} />;
    }
    
    // 空星
    return <StarEmptyIcon className={`${starSizeClass} ${readOnly ? 'text-gray-300' : 'text-gray-300 hover:text-amber-200'}`} />;
  };
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <div 
          key={star} 
          className={`relative ${readOnly ? '' : 'cursor-pointer'} mx-0.5 ${readOnly ? '' : 'hover:scale-110 transition-transform'}`}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          {/* 整星 */}
          <div>
            {renderStar(star)}
          </div>
          
          {/* 半星选择区域 - 只有在非只读模式下显示 */}
          {!readOnly && onChange && (
            <div 
              className="absolute top-0 left-0 w-1/2 h-full z-10 hover:bg-blue-100/10"
              onClick={(e) => {
                e.stopPropagation();
                onChange(star - 0.5);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// 添加编辑图标
const EditIcon = (props: { className?: string }) => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
    />
  </svg>
)

export function GameTodoList() {
  // const { t } = useTranslation()
  const [todos, setTodos] = useState<GameTodo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id?: string, email?: string } | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<GameGroup | null>(null)
  const [userGroups, setUserGroups] = useState<GameGroup[]>([])
  const [joinedGroups, setJoinedGroups] = useState<GameGroup[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    link: string;
    note: string;
    price: string;
  }>({
    link: '',
    note: '',
    price: '',
  })
  const [comments, setComments] = useState<Record<string, GameComment[]>>({})
  const [newComment, setNewComment] = useState('')
  const [commentingTodo, setCommentingTodo] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [tags, setTags] = useState<GameTag[]>([])
  const [loadingTags, setLoadingTags] = useState(false)
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [editingTodoTags, setEditingTodoTags] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6') // 默认蓝色
  const [tagError, setTagError] = useState('')
  const [userRatings, setUserRatings] = useState<Record<string, number>>({}) // 用户对每个游戏的评分
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortOption, setSortOption] = useState<string>("default")
  const [sortedTodos, setSortedTodos] = useState<GameTodo[]>([])
  // 获取通知上下文
  const { markTodosAsRead } = useNotifications();

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

  // 加载用户的游戏组
  useEffect(() => {
    if (!user?.id) return;

    const loadGroups = async () => {
      setLoadingGroups(true);
      try {
        // 获取用户创建的组
        const { data: createdGroups, error: createdError } = await getUserCreatedGroups();
        if (createdError) {
          console.error("获取创建的组失败:", createdError);
        }
        
        // 确保createdGroups是数组
        const safeCreatedGroups = Array.isArray(createdGroups) ? createdGroups : [];
        setUserGroups(safeCreatedGroups);

        // 获取用户加入的组
        const { data: joined, error: joinedError } = await getUserJoinedGroups();
        if (joinedError) {
          console.error("获取加入的组失败:", joinedError);
        }
        
        // 确保joined是数组并转换类型
        const safeJoinedGroups = Array.isArray(joined) ? joined as unknown as GameGroup[] : [];
        setJoinedGroups(safeJoinedGroups);

        // 获取URL中的组ID参数
        const urlParams = new URLSearchParams(window.location.search);
        const groupIdParam = urlParams.get('groupId');
        
        // 合并所有组，确保过滤掉null或undefined
        const allGroups = [...safeCreatedGroups, ...safeJoinedGroups].filter(Boolean);
        
        // 如果URL中有组ID，并且用户属于该组，则选择该组
        if (groupIdParam) {
          const selectedGroupFromUrl = allGroups.find(g => g && g.id === groupIdParam);
          if (selectedGroupFromUrl) {
            setSelectedGroup(selectedGroupFromUrl);
          } else {
            console.warn(`未找到ID为 ${groupIdParam} 的组`);
          }
        } 
        // 如果没有URL参数但用户有组，默认选择第一个组（优先选择创建的组）
        else if (allGroups.length > 0) {
          setSelectedGroup(allGroups[0]);
        }
      } catch (error) {
        console.error("加载游戏组失败:", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    loadGroups();
  }, [user?.id]);

  // 加载待玩游戏列表
  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchTodos = async () => {
      try {
        setLoading(true)
        
        // 标记所有未读游戏为已读
        await markTodosAsRead();
        
        let query = supabase
          .from('game_todos')
          .select('*')
        
        if (selectedGroup) {
          // 如果选择了组，则筛选该组的待玩游戏
          query = query.eq('group_id', selectedGroup.id)
        } else {
          // 否则只显示用户自己的非组待玩游戏
          query = query.eq('user_id', user.id).is('group_id', null)
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error('获取待玩游戏列表失败:', error)
          return
        }
        
        // 根据排序方式排序结果
        const sortedData = [...(data || [])]
        if (sortOption === 'rating') {
          sortedData.sort((a, b) => {
            const ratingA = a.avg_rating || 0
            const ratingB = b.avg_rating || 0
            return ratingB - ratingA // 从高到低排序
          })
        } else {
          // 默认按创建时间排序
          sortedData.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
        }
        
        setTodos(sortedData)

        // 获取当前用户对这些游戏的评分
        if (data && data.length > 0 && user?.id) {
          const todoIds = data.map(todo => todo.id);
          const { data: ratingsData, error: ratingsError } = await supabase
            .from('game_ratings')
            .select('*')
            .eq('user_id', user.id)
            .in('game_todo_id', todoIds);
          
          if (ratingsError) {
            console.error('获取用户评分失败:', ratingsError);
            return;
          }

          // 将评分数据转换为以游戏ID为键的对象
          const userRatingsMap: Record<string, number> = {};
          ratingsData?.forEach(rating => {
            userRatingsMap[rating.game_todo_id] = rating.rating;
          });
          
          setUserRatings(userRatingsMap);
        }
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
          filter: selectedGroup
            ? `group_id=eq.${selectedGroup.id}`
            : `user_id=eq.${user.id}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTodo = payload.new as GameTodo;
            // 只有当新添加的待办事项符合当前筛选条件时才添加
            if ((selectedGroup && newTodo.group_id === selectedGroup.id) || 
                (!selectedGroup && newTodo.user_id === user.id && !newTodo.group_id)) {
              setTodos(current => [newTodo, ...current]);
            }
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
  }, [user?.id, selectedGroup, sortOption]);

  // 加载游戏留言
  useEffect(() => {
    if (!user?.id || todos.length === 0) return;

    const fetchComments = async () => {
      try {
        // 获取所有当前显示的游戏ID
        const todoIds = todos.map(todo => todo.id);
        
        // 直接查询留言表，不使用关系查询
        const { data, error } = await supabase
          .from('game_comments')
          .select(`
            id,
            game_todo_id,
            user_id,
            content,
            created_at
          `)
          .in('game_todo_id', todoIds)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('获取游戏留言失败:', error);
          return;
        }
        
        // 获取留言相关用户信息
        if (data && data.length > 0) {
          // 获取所有用户ID
          const userIds = [...new Set(data.map(comment => comment.user_id))];
          
          // 首先从profiles表获取用户信息
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, email')
            .in('id', userIds);
            
          if (profilesError) {
            console.error('获取用户profiles失败:', profilesError);
          }
          
          // 创建profiles信息映射
          const profilesMap: Record<string, { username?: string, email?: string }> = {};
          
          // 从profiles表填充用户信息
          if (profilesData) {
            profilesData.forEach((profile: { id: string, username?: string, email?: string }) => {
              profilesMap[profile.id] = { 
                username: profile.username, 
                email: profile.email 
              };
            });
          }
          
          // 从users表获取用户信息（作为备用）
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, username')
            .in('id', userIds);
          
          if (userError) {
            console.error('获取用户信息失败:', userError);
          }

          // 创建用户信息映射
          const userMap: Record<string, { email?: string, username?: string }> = {};
          
          // 从users表填充用户信息
          if (userData) {
            userData.forEach((user: { id: string, email?: string, username?: string }) => {
              userMap[user.id] = { email: user.email, username: user.username };
            });
          }
          
          // 合并留言和用户信息，优先使用profiles表中的信息
          const enhancedComments = data.map((comment): GameComment => ({
            ...comment,
            user_profile_name: profilesMap[comment.user_id]?.username,
            user_email: profilesMap[comment.user_id]?.email || userMap[comment.user_id]?.email,
            user_username: userMap[comment.user_id]?.username
          }));
          
          // 按游戏ID分组留言
          const commentsByTodo: Record<string, GameComment[]> = {};
          enhancedComments.forEach((comment: GameComment) => {
            if (!commentsByTodo[comment.game_todo_id]) {
              commentsByTodo[comment.game_todo_id] = [];
            }
            commentsByTodo[comment.game_todo_id].push(comment);
          });
          
          setComments(commentsByTodo);
        } else {
          setComments({});
        }
      } catch (error) {
        console.error('获取游戏留言异常:', error);
      }
    };

    fetchComments();

    // 设置实时订阅
    const subscription = supabase
      .channel('game_comments_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_comments'
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newComment = payload.new as GameComment;
            
            // 首先从profiles表获取用户信息
            supabase
              .from('profiles')
              .select('name, email')
              .eq('id', newComment.user_id)
              .single()
              .then(({ data: profileData }) => {
                if (profileData) {
                  newComment.user_profile_name = profileData.name;
                  newComment.user_email = profileData.email;
                }
                
                // 无论profiles表是否有数据，都尝试从users表获取补充信息
                supabase
                  .from('users')
                  .select('email, username')
                  .eq('id', newComment.user_id)
                  .single()
                  .then(({ data: userData }) => {
                    if (userData) {
                      // 只有在profiles没有提供email时才使用users表的email
                      if (!newComment.user_email) {
                        newComment.user_email = userData.email;
                      }
                      newComment.user_username = userData.username;
                    }
                    
                    // 更新评论列表
                    setComments(current => {
                      const updated = { ...current };
                      if (!updated[newComment.game_todo_id]) {
                        updated[newComment.game_todo_id] = [];
                      }
                      updated[newComment.game_todo_id] = [...updated[newComment.game_todo_id], newComment];
                      return updated;
                    });
                  });
              });
          }
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [todos, user?.id]);

  // 确保当前用户信息已在users表中
  useEffect(() => {
    if (!user?.id || !user?.email) return;

    // 创建或更新用户profile
    const syncUserProfile = async () => {
      try {
        // 检查用户是否已存在users表中
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 是 "未找到结果" 错误
          console.error('检查用户profile失败:', error);
          return;
        }
        
        // 如果用户不存在，创建用户profile
        if (!data && user.id && user.email) { // 额外检查确保user.id和user.email存在
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: user.id,
              email: user.email,
              username: user.email.split('@')[0] || 'user' // 默认使用邮箱前缀作为用户名
            }]);
          
          if (insertError) {
            console.error('创建用户profile失败:', insertError);
          }
        }
      } catch (error) {
        console.error('同步用户profile异常:', error);
      }
    };
    
    syncUserProfile();
  }, [user?.id, user?.email]);

  // 加载游戏标签
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);
        const { data, error } = await supabase
          .from('game_tags')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('获取游戏标签失败:', error);
          return;
        }
        
        setTags(data || []);
      } catch (error) {
        console.error('获取游戏标签异常:', error);
      } finally {
        setLoadingTags(false);
      }
    };
    
    fetchTags();
    
    // 设置实时订阅
    const subscription = supabase
      .channel('game_tags_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_tags'
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTags(current => [payload.new as GameTag, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setTags(current => 
              current.map(tag => 
                tag.id === payload.new.id ? (payload.new as GameTag) : tag
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setTags(current => 
              current.filter(tag => tag.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 添加待玩游戏
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTodo.trim() || !user?.id) return
    
    try {
      const newTodoItem = {
        title: newTodo.trim(),
        is_completed: false,
        user_id: user.id,
        group_id: selectedGroup?.id || null // 添加到当前选择的组
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
      
      if (error) {
        console.error('更新待玩游戏状态失败:', error)
      }
    } catch (error) {
      console.error('更新待玩游戏状态异常:', error)
    }
  }

  // 更新游戏评分
  const updateRating = async (todoId: string, rating: number) => {
    if (!user?.id) return;
    
    try {
      // 添加或更新用户对游戏的评分
      const { error } = await supabase
        .from('game_ratings')
        .upsert({
          game_todo_id: todoId,
          user_id: user.id,
          rating,
          rated_at: new Date().toISOString()
        }, {
          onConflict: 'game_todo_id,user_id'
        });
      
      if (error) {
        console.error('更新游戏评分失败:', error);
        return;
      }
      
      // 更新本地状态
      setUserRatings(prev => ({
        ...prev,
        [todoId]: rating
      }));
    } catch (error) {
      console.error('更新游戏评分异常:', error);
    }
  }

  // 删除待玩游戏
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('game_todos')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('删除待玩游戏失败:', error)
      }
    } catch (error) {
      console.error('删除待玩游戏异常:', error)
    }
  }

  // 更新游戏信息
  const updateTodoDetails = async (id: string) => {
    try {
      const priceValue = editForm.price ? parseFloat(editForm.price) : undefined;
      
      const { error } = await supabase
        .from('game_todos')
        .update({ 
          link: editForm.link || null,
          note: editForm.note || null,
          price: priceValue 
        })
        .eq('id', id)
      
      if (error) {
        console.error('更新游戏信息失败:', error)
      } else {
        // 成功后关闭编辑模式
        setEditingTodo(null)
      }
    } catch (error) {
      console.error('更新游戏信息异常:', error)
    }
  }

  // 开始编辑待玩游戏
  const startEditing = (todo: GameTodo) => {
    setEditingTodo(todo.id)
    setEditForm({
      link: todo.link || '',
      note: todo.note || '',
      price: todo.price?.toString() || '',
    })
  }

  // 取消编辑
  const cancelEditing = () => {
    setEditingTodo(null)
  }

  // 渲染游戏组选择器
  const renderGroupSelector = () => {
    if (loadingGroups) {
      return <div className="text-sm text-gray-500">加载中...</div>;
    }

    const allGroups = [...userGroups, ...joinedGroups].filter(group => group && group.id);
    
    if (allGroups.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">选择游戏组</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedGroup(null);
              // 更新URL，移除groupId参数
              const url = new URL(window.location.href);
              url.searchParams.delete('groupId');
              window.history.pushState({}, '', url);
            }}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              selectedGroup === null 
                ? 'bg-blue-100 border-blue-300 text-blue-800' 
                : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            个人清单
          </button>
          
          {allGroups.map(group => group && (
            <button
              key={group.id}
              onClick={() => {
                setSelectedGroup(group);
                // 更新URL，添加groupId参数
                const url = new URL(window.location.href);
                url.searchParams.set('groupId', group.id);
                window.history.pushState({}, '', url);
              }}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedGroup?.id === group.id
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {group.name || '未命名组'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 渲染编辑表单
  const renderEditForm = (todo: GameTodo) => {
    return (
      <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            游戏链接
          </label>
          <Input
            type="text"
            value={editForm.link}
            onChange={(e) => setEditForm({...editForm, link: e.target.value})}
            placeholder="输入游戏链接..."
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            游戏留言
          </label>
          <textarea
            value={editForm.note}
            onChange={(e) => setEditForm({...editForm, note: e.target.value})}
            placeholder="输入游戏留言..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            游戏价格
          </label>
          <Input
            type="number"
            value={editForm.price}
            onChange={(e) => setEditForm({...editForm, price: e.target.value})}
            placeholder="输入游戏价格..."
            className="w-full"
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={cancelEditing}>
            取消
          </Button>
          <Button onClick={() => updateTodoDetails(todo.id)}>
            保存
          </Button>
        </div>
      </div>
    )
  }

  // 添加留言
  const addComment = async (todoId: string) => {
    if (!newComment.trim() || !user?.id || !user?.email) return;
    
    try {
      const email = user.email as string; // 类型断言，告诉TypeScript此时email一定存在
      
      // 先确保用户数据在users表中
      await supabase.from('users').upsert([{
        id: user.id,
        email: email,
        // 使用邮箱前缀作为用户名
        username: email.split('@')[0] || 'user'
      }], {
        onConflict: 'id'
      });
      
      // 然后添加留言
      const { error } = await supabase
        .from('game_comments')
        .insert([{
          game_todo_id: todoId,
          user_id: user.id,
          content: newComment.trim()
        }]);
      
      if (error) {
        console.error('添加留言失败:', error);
        return;
      }
      
      // 清空输入并关闭留言框
      setNewComment('');
      setCommentingTodo(null);
    } catch (error) {
      console.error('添加留言异常:', error);
    }
  };

  // 开始留言
  const startCommenting = (todoId: string) => {
    setCommentingTodo(todoId);
    setNewComment('');
  };

  // 取消留言
  const cancelCommenting = () => {
    setCommentingTodo(null);
    setNewComment('');
  };

  // 切换留言展开/折叠状态
  const toggleCommentExpand = (todoId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [todoId]: !prev[todoId]
    }));
  };

  // 渲染留言表单
  const renderCommentForm = (todoId: string) => {
    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的留言..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={cancelCommenting}>
            取消
          </Button>
          <Button size="sm" onClick={() => addComment(todoId)} disabled={!newComment.trim()}>
            添加留言
          </Button>
        </div>
      </div>
    );
  };

  // 渲染留言列表
  const renderComments = (todoId: string) => {
    const todoComments = comments[todoId] || [];
    const isExpanded = expandedComments[todoId] || false;
    const MAX_VISIBLE_COMMENTS = 3;
    const hasMoreComments = todoComments.length > MAX_VISIBLE_COMMENTS;
    
    // 根据展开状态决定显示的留言
    const visibleComments = isExpanded 
      ? todoComments 
      : todoComments.slice(0, MAX_VISIBLE_COMMENTS);
    
    if (todoComments.length === 0 && commentingTodo !== todoId) {
      return (
        <button
          onClick={() => startCommenting(todoId)}
          className="text-sm text-blue-600 hover:text-blue-800 mt-2"
        >
          添加第一条留言
        </button>
      );
    }
    
    return (
      <div className="mt-2">
        {todoComments.length > 0 && (
          <div className="space-y-2 mb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">留言</h4>
              {hasMoreComments && (
                <button 
                  onClick={() => toggleCommentExpand(todoId)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {isExpanded 
                    ? '收起留言' 
                    : `展开全部(${todoComments.length})`}
                </button>
              )}
            </div>
            
            {visibleComments.map(comment => {
              // 优先使用profiles表中的name字段，其次是users表中的username，再次是email
              const displayName = comment.user_profile_name || comment.user_username || comment.user_email || (comment.user_id === user?.id ? '我' : '用户');
              return (
                <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded-md flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium text-blue-700">{displayName}:</span>
                  <span className="text-gray-700 flex-1 break-words">{comment.content}</span>
                  <span className="text-xs text-gray-500 ml-auto">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
              );
            })}
            
            {hasMoreComments && !isExpanded && (
              <div className="text-center">
                <button 
                  onClick={() => toggleCommentExpand(todoId)}
                  className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  <span>查看更多留言(${todoComments.length - MAX_VISIBLE_COMMENTS})</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        
        {commentingTodo === todoId ? (
          renderCommentForm(todoId)
        ) : (
          <button
            onClick={() => startCommenting(todoId)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            添加留言
          </button>
        )}
      </div>
    );
  };

  // 打开标签管理弹窗
  const openTagModal = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      setSelectedTags(todo.tags || []);
      setEditingTodoTags(todoId);
      setTagModalOpen(true);
    }
  };

  // 关闭标签管理弹窗
  const closeTagModal = () => {
    setTagModalOpen(false);
    setEditingTodoTags(null);
    setSelectedTags([]);
    setNewTagName('');
    setNewTagColor('#3B82F6');
    setTagError('');
  };

  // 切换标签选择状态
  const toggleTagSelection = (tagId: string) => {
    setSelectedTags(current => 
      current.includes(tagId)
        ? current.filter(id => id !== tagId)
        : [...current, tagId]
    );
  };

  // 创建新标签
  const createTag = async () => {
    if (!newTagName.trim()) {
      setTagError('标签名称不能为空');
      return;
    }
    
    if (!user?.id) return;
    
    try {
      setTagError('');
      const { data, error } = await supabase
        .from('game_tags')
        .insert([
          {
            name: newTagName.trim(),
            color: newTagColor,
            creator_id: user.id
          }
        ])
        .select()
        .single();
        
      if (error) {
        console.error('创建标签失败:', error);
        setTagError('创建标签失败');
        return;
      }
      
      // 自动选中新创建的标签
      if (data) {
        setSelectedTags(current => [...current, data.id]);
        setNewTagName('');
      }
    } catch (error) {
      console.error('创建标签异常:', error);
      setTagError('创建标签失败');
    }
  };

  // 保存待玩游戏标签
  const saveTodoTags = async () => {
    if (!editingTodoTags) return;
    
    try {
      const { error } = await supabase
        .from('game_todos')
        .update({ tags: selectedTags })
        .eq('id', editingTodoTags);
        
      if (error) {
        console.error('更新游戏标签失败:', error);
        return;
      }
      
      // 更新本地状态
      setTodos(current => 
        current.map(todo => 
          todo.id === editingTodoTags
            ? { ...todo, tags: selectedTags }
            : todo
        )
      );
      
      closeTagModal();
    } catch (error) {
      console.error('更新游戏标签异常:', error);
    }
  };

  // 获取标签显示名称
  const getTagDisplayName = (tag: GameTag) => {
    return tag.name;
  };

  // 渲染标签管理弹窗
  const renderTagModal = () => {
    if (!tagModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">管理标签</h3>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            {loadingTags ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <>
                <h4 className="font-medium mb-2">选择标签</h4>
                <div className="space-y-2 mb-6">
                  {tags.length === 0 ? (
                    <p className="text-sm text-gray-500">没有可用的标签</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTagSelection(tag.id)}
                          className={`px-2 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.includes(tag.id)
                              ? 'opacity-100 ring-2 ring-offset-1'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ 
                            backgroundColor: tag.color,
                            color: getContrastColor(tag.color)
                          }}
                        >
                          {getTagDisplayName(tag)}
                          {selectedTags.includes(tag.id) && (
                            <span className="ml-1">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <h4 className="font-medium mb-2">创建新标签</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">标签名称</label>
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="输入标签名称"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">标签颜色</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-12 h-9 p-1 cursor-pointer"
                      />
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          placeholder="#HEX"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {tagError && (
                    <p className="text-sm text-red-500">{tagError}</p>
                  )}
                  
                  <Button
                    onClick={createTag}
                    className="w-full"
                    disabled={!newTagName.trim()}
                  >
                    创建标签
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
            <Button variant="outline" onClick={closeTagModal}>
              取消
            </Button>
            <Button onClick={saveTodoTags}>
              保存
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 辅助函数：根据背景色获取对比色文本
  const getContrastColor = (hexColor: string) => {
    // 简单转换十六进制为RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // 计算亮度 (W3C推荐公式)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 亮度大于125返回黑色，否则返回白色
    return brightness > 125 ? '#000000' : '#FFFFFF';
  };

  // 渲染游戏标签
  const renderTags = (todo: GameTodo) => {
    if (!todo.tags || todo.tags.length === 0) return null;
    
    const todoTags = tags.filter(tag => todo.tags?.includes(tag.id));
    
    return (
      <div className="mt-1 flex flex-wrap gap-1">
        {todoTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: tag.color,
              color: getContrastColor(tag.color)
            }}
          >
            {getTagDisplayName(tag)}
          </span>
        ))}
        <button
          onClick={() => openTagModal(todo.id)}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          编辑
        </button>
      </div>
    );
  };

  // 处理排序逻辑
  const sortTodos = (todos: GameTodo[], option: string) => {
    const sortedList = [...todos];
    
    switch (option) {
      case "avg_rating_high":
        sortedList.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
        break;
      case "avg_rating_low":
        sortedList.sort((a, b) => (a.avg_rating || 0) - (b.avg_rating || 0));
        break;
      case "my_rating_high":
        sortedList.sort((a, b) => {
          const ratingA = userRatings[a.id] || 0;
          const ratingB = userRatings[b.id] || 0;
          return ratingB - ratingA;
        });
        break;
      case "my_rating_low":
        sortedList.sort((a, b) => {
          const ratingA = userRatings[a.id] || 0;
          const ratingB = userRatings[b.id] || 0;
          return ratingA - ratingB;
        });
        break;
      case "name_asc":
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        sortedList.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default: // 默认按最新添加排序
        sortedList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    
    return sortedList;
  };

  // 过滤并排序游戏列表
  useEffect(() => {
    // 先过滤，再排序
    let filteredList = todos;
    if (searchTerm) {
      filteredList = todos.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const sorted = sortTodos(filteredList, sortOption);
    setSortedTodos(sorted);
  }, [todos, searchTerm, sortOption, userRatings]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">请登录后查看您的待玩游戏清单</p>
        <Button asChild>
          <a href="/signin">登录</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">待玩游戏清单</h2>
      
      <form onSubmit={addTodo} className="flex mb-6 gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="添加待玩的游戏..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newTodo.trim()}>
          <PlusIcon className="h-5 w-5" />
        </Button>
      </form>
      
      {renderGroupSelector()}
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="搜索游戏..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </div>
          </div>
        
          <div className="relative min-w-[180px]">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="default">最新添加</option>
              <option value="avg_rating_high">平均评分 (高→低)</option>
              <option value="avg_rating_low">平均评分 (低→高)</option>
              <option value="my_rating_high">我的评分 (高→低)</option>
              <option value="my_rating_low">我的评分 (低→高)</option>
              <option value="name_asc">名称 (A→Z)</option>
              <option value="name_desc">名称 (Z→A)</option>
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SortIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          您的待玩游戏清单为空，添加一些游戏吧！
        </div>
      ) : (
        <ul className="space-y-6">
          {sortedTodos.map((todo) => (
            <li key={todo.id} className="flex flex-col border-b pb-4 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={`todo-${todo.id}`}
                    checked={todo.is_completed}
                    onCheckedChange={() => toggleTodo(todo.id, todo.is_completed)}
                    className="h-5 w-5"
                  />
                  <div className="flex flex-col">
                    <label 
                      htmlFor={`todo-${todo.id}`}
                      className={`${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700'} text-lg font-medium flex items-center gap-2`}
                    >
                      {todo.link ? (
                        <a 
                          href={todo.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {todo.title}
                        </a>
                      ) : (
                        todo.title
                      )}
                      {todo.group_id && selectedGroup && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedGroup.name}
                        </span>
                      )}
                      {todo.price && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          ¥{todo.price.toFixed(2)}
                        </span>
                      )}
                    </label>
                    {renderTags(todo)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openTagModal(todo.id)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    aria-label="管理标签"
                    title="管理标签"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => startEditing(todo)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    aria-label="编辑"
                  >
                    <EditIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="删除"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {todo.note && editingTodo !== todo.id && (
                <div className="ml-7 mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                  <span className="font-medium">游戏备注: </span>{todo.note}
                </div>
              )}
              
              {editingTodo === todo.id ? (
                renderEditForm(todo)
              ) : (
                <>
                  <div className="ml-7 mt-3">
                    <div className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors p-3 rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-gray-600 mr-3">我的评分:</span>
                      <div className="flex-grow">
                        <RatingStars 
                          rating={userRatings[todo.id] || 0}
                          onChange={(newRating) => updateRating(todo.id, newRating)}
                          size="md"
                        />
                      </div>
                      {userRatings[todo.id] ? (
                        <span className="ml-2 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          {userRatings[todo.id].toFixed(1)}
                        </span>
                      ) : (
                        <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          未评分
                        </span>
                      )}
                    </div>
                    
                    {(todo.group_id && todo.avg_rating && todo.avg_rating > 0) && (
                      <div className="flex items-center mt-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600 mr-3">组内平均分:</span>
                        <div className="flex-grow">
                          <RatingStars 
                            rating={todo.avg_rating}
                            readOnly={true}
                            size="md"
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {todo.avg_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-7 mt-2">
                    {renderComments(todo.id)}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {renderTagModal()}
    </div>
  )
} 