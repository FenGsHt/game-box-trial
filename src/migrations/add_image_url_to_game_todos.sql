-- 向game_todos表添加image_url字段
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 为image_url字段创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS game_todos_image_url_idx ON game_todos (image_url); 