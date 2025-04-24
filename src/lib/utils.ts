import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期的辅助函数
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// 生成唯一ID的函数
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

// 游戏评分格式化函数
export function formatGameRating(rating: number): string {
  return rating.toFixed(1)
}
