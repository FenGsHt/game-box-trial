'use client'

import { useQuery } from '@tanstack/react-query'
import { Game, fetchGames } from '@/lib/supabase'

export type SortOption = 
  | 'relevance' 
  | 'price_low' 
  | 'price_high' 
  | 'rating' 
  | 'release'

interface UseGamesOptions {
  category?: string
  sortBy?: SortOption
  search?: string
  limit?: number
  page?: number
}

export function useGames({
  category = 'all',
  sortBy = 'relevance',
  search = '',
  limit = 12,
  page = 1
}: UseGamesOptions = {}) {
  return useQuery({
    queryKey: ['games', category, sortBy, search, page, limit],
    queryFn: async () => {
      // 在实际项目中，这些参数应该传递给服务器端 API
      const games = await fetchGames()
      
      // 客户端过滤和排序 (实际项目中应该在服务器端进行)
      let filteredGames = [...games]
      
      // 按类别过滤
      if (category !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === category)
      }
      
      // 搜索过滤
      if (search) {
        const searchLower = search.toLowerCase()
        filteredGames = filteredGames.filter(game => 
          game.title.toLowerCase().includes(searchLower) || 
          game.description.toLowerCase().includes(searchLower)
        )
      }
      
      // 排序
      filteredGames = sortGames(filteredGames, sortBy)
      
      // 分页
      const total = filteredGames.length
      const totalPages = Math.ceil(total / limit)
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedGames = filteredGames.slice(start, end)
      
      return {
        games: paginatedGames,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit
        }
      }
    },
    // 10分钟缓存
    staleTime: 10 * 60 * 1000
  })
}

function sortGames(games: Game[], sortBy: SortOption): Game[] {
  switch (sortBy) {
    case 'price_low':
      return [...games].sort((a, b) => 
        (a.discountPrice || a.price) - (b.discountPrice || b.price)
      )
    case 'price_high':
      return [...games].sort((a, b) => 
        (b.discountPrice || b.price) - (a.discountPrice || a.price)
      )
    case 'rating':
      return [...games].sort((a, b) => b.rating - a.rating)
    case 'release':
      return [...games].sort((a, b) => 
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      )
    case 'relevance':
    default:
      return games
  }
} 