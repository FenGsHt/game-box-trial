"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Game } from '@/lib/supabase'
import { formatGameRating } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const {
    id,
    title,
    imageUrl,
    category,
    rating,
    price,
    discountPrice,
    platform
  } = game

  const discount = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Link href={`/game/${id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl || '/images/placeholder-game.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-yellow-500 mr-1" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.2z" />
            </svg>
            <span className="text-sm font-medium">{formatGameRating(rating)}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="bg-gray-100 rounded-full px-3 py-1">{category}</span>
          <div className="flex ml-2 space-x-1">
            {platform.map((p) => (
              <span key={p} className="text-xs">
                {p === 'PC' && '🖥️'}
                {p === 'PlayStation' && '🎮'}
                {p === 'Xbox' && '🎯'}
                {p === 'Mobile' && '📱'}
                {p === 'Switch' && '🕹️'}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {discountPrice ? (
              <>
                <span className="text-gray-500 line-through text-sm mr-2">¥{price}</span>
                <span className="font-bold text-red-500">¥{discountPrice}</span>
              </>
            ) : (
              <span className="font-bold text-gray-900">¥{price}</span>
            )}
          </div>
          <Button size="sm" variant="default">
            加入购物车
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 