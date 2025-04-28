-- 添加is_viewed字段到game_todos表
ALTER TABLE game_todos 
ADD COLUMN IF NOT EXISTS is_viewed BOOLEAN DEFAULT FALSE;

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_game_todos_is_viewed ON game_todos(is_viewed);

-- 将所有现有记录标记为已查看
UPDATE game_todos SET is_viewed = TRUE WHERE is_viewed IS NULL;

-- 确保RLS策略仍然有效
ALTER TABLE game_todos REPLICA IDENTITY FULL; 