-- 创建游戏待玩清单表
CREATE TABLE IF NOT EXISTS game_todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用实时功能
ALTER TABLE game_todos REPLICA IDENTITY FULL;

-- 为待玩游戏清单创建RLS策略
-- 允许用户查看自己的待玩游戏
CREATE POLICY "允许用户查看自己的待玩游戏" ON game_todos
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 允许用户添加待玩游戏
CREATE POLICY "允许用户添加待玩游戏" ON game_todos
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 允许用户更新自己的待玩游戏
CREATE POLICY "允许用户更新自己的待玩游戏" ON game_todos
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- 允许用户删除自己的待玩游戏
CREATE POLICY "允许用户删除自己的待玩游戏" ON game_todos
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 启用RLS
ALTER TABLE game_todos ENABLE ROW LEVEL SECURITY;

-- 添加索引提高查询性能
CREATE INDEX idx_game_todos_user_id ON game_todos(user_id);
CREATE INDEX idx_game_todos_created_at ON game_todos(created_at); 