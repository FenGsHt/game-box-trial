-- 创建游戏评分表，用于存储每个用户对游戏的评分
CREATE TABLE IF NOT EXISTS game_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_todo_id UUID NOT NULL REFERENCES game_todos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  rated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (game_todo_id, user_id)
);

-- 启用实时功能
ALTER TABLE game_ratings REPLICA IDENTITY FULL;

-- 为游戏评分表创建索引
CREATE INDEX idx_game_ratings_game_todo_id ON game_ratings(game_todo_id);
CREATE INDEX idx_game_ratings_user_id ON game_ratings(user_id);

-- 允许用户查看评分
CREATE POLICY "允许用户查看游戏评分" ON game_ratings
  FOR SELECT
  TO authenticated
  USING (
    -- 用户可以查看自己的评分
    user_id = auth.uid() OR
    -- 或者用户可以查看自己组内的游戏评分
    EXISTS (
      SELECT 1 FROM game_todos
      WHERE game_todos.id = game_ratings.game_todo_id
      AND (
        -- 用户自己的游戏
        game_todos.user_id = auth.uid() OR
        -- 用户所在组的游戏
        EXISTS (
          SELECT 1 FROM game_group_members
          WHERE game_group_members.group_id = game_todos.group_id
          AND game_group_members.user_id = auth.uid()
        )
      )
    )
  );

-- 允许用户添加或更新自己的评分
CREATE POLICY "允许用户添加自己的评分" ON game_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM game_todos
      WHERE game_todos.id = game_ratings.game_todo_id
      AND (
        -- 用户自己的游戏
        game_todos.user_id = auth.uid() OR
        -- 用户所在组的游戏
        EXISTS (
          SELECT 1 FROM game_group_members
          WHERE game_group_members.group_id = game_todos.group_id
          AND game_group_members.user_id = auth.uid()
        )
      )
    )
  );

-- 允许用户更新自己的评分
CREATE POLICY "允许用户更新自己的评分" ON game_ratings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- 允许用户删除自己的评分
CREATE POLICY "允许用户删除自己的评分" ON game_ratings
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 启用RLS
ALTER TABLE game_ratings ENABLE ROW LEVEL SECURITY;

-- 修改游戏待玩清单表，添加avg_rating字段
ALTER TABLE game_todos DROP COLUMN IF EXISTS rating CASCADE;
ALTER TABLE game_todos ADD COLUMN avg_rating NUMERIC(2,1) DEFAULT 0;

-- 创建函数来计算游戏的平均评分
CREATE OR REPLACE FUNCTION update_game_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新受影响的游戏的平均评分
    UPDATE game_todos
    SET avg_rating = COALESCE((
        SELECT AVG(rating)
        FROM game_ratings
        WHERE game_todo_id = CASE
            WHEN TG_OP = 'DELETE' THEN OLD.game_todo_id
            ELSE NEW.game_todo_id
        END
    ), 0)
    WHERE id = CASE
        WHEN TG_OP = 'DELETE' THEN OLD.game_todo_id
        ELSE NEW.game_todo_id
    END;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器，在评分表变更时更新平均评分
CREATE TRIGGER trigger_update_game_avg_rating
AFTER INSERT OR UPDATE OR DELETE ON game_ratings
FOR EACH ROW EXECUTE FUNCTION update_game_avg_rating();

-- 初始化所有游戏的平均评分
DO $$
BEGIN
    UPDATE game_todos
    SET avg_rating = COALESCE((
        SELECT AVG(rating)
        FROM game_ratings
        WHERE game_ratings.game_todo_id = game_todos.id
    ), 0);
END $$; 