-- 向game_todos表添加preview_images字段，用于存储游戏预览图片URL数组
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS preview_images TEXT[]; 