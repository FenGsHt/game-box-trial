import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// 格式化游戏评分
export const formatGameRating = (rating: number): string => {
  return rating.toFixed(1)
}

// 格式化日期
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// 合并className的工具函数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 生成唯一ID的函数
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

// 截断文本
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
