import { createClient } from '@supabase/supabase-js'

// 注意：实际使用时应该使用环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 游戏数据接口
export interface Game {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  tags: string[]
  rating: number
  releaseDate: string
  developer: string
  publisher: string
  platform: string[]
  price: number
  discountPrice?: number
  created_at: string
}

// 用户数据接口
export interface User {
  id: string
  username: string
  email: string
  avatarUrl?: string
  bio?: string
  created_at: string
}

// 游戏数据获取函数
export async function fetchGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching games:', error)
    return []
  }
  
  return data || []
}

// 用户数据获取函数
export async function fetchCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    console.error('Error fetching current user:', error)
    return null
  }
  
  return user
} 