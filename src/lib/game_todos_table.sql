-- 创建游戏组表
CREATE TABLE IF NOT EXISTS game_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建游戏组成员表
CREATE TABLE IF NOT EXISTS game_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES game_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);

-- 创建游戏待玩清单表
CREATE TABLE IF NOT EXISTS game_todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  user_id UUID NOT NULL,
  group_id UUID REFERENCES game_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用实时功能
ALTER TABLE game_groups REPLICA IDENTITY FULL;
ALTER TABLE game_group_members REPLICA IDENTITY FULL;
ALTER TABLE game_todos REPLICA IDENTITY FULL;

-- 游戏组的行级安全策略
CREATE POLICY "允许用户查看自己创建的组" ON game_groups
  FOR SELECT
  TO authenticated
  USING (leader_id = auth.uid());

CREATE POLICY "允许用户创建组" ON game_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (leader_id = auth.uid());

CREATE POLICY "允许组长更新组信息" ON game_groups
  FOR UPDATE
  TO authenticated
  USING (leader_id = auth.uid());

CREATE POLICY "允许组长删除组" ON game_groups
  FOR DELETE
  TO authenticated
  USING (leader_id = auth.uid());

-- 游戏组成员的行级安全策略
CREATE POLICY "允许组长查看组成员" ON game_group_members
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM game_groups
    WHERE game_groups.id = game_group_members.group_id
    AND game_groups.leader_id = auth.uid()
  ));

CREATE POLICY "允许成员查看自己所属的组" ON game_group_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "允许组长添加组成员" ON game_group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM game_groups
    WHERE game_groups.id = game_group_members.group_id
    AND game_groups.leader_id = auth.uid()
  ));

CREATE POLICY "允许组长或成员自己退出组" ON game_group_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM game_groups
    WHERE game_groups.id = game_group_members.group_id
    AND game_groups.leader_id = auth.uid()
  ));

-- 待玩游戏清单的行级安全策略
CREATE POLICY "允许用户查看自己组内的待玩游戏" ON game_todos
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM game_group_members
      WHERE game_group_members.group_id = game_todos.group_id
      AND game_group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "允许用户添加待玩游戏到自己的组" ON game_todos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND (
      group_id IS NULL OR
      EXISTS (
        SELECT 1 FROM game_group_members
        WHERE game_group_members.group_id = game_todos.group_id
        AND game_group_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "允许用户更新自己的待玩游戏" ON game_todos
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (
      EXISTS (
        SELECT 1 FROM game_groups
        WHERE game_groups.id = game_todos.group_id
        AND game_groups.leader_id = auth.uid()
      )
    )
  );

CREATE POLICY "允许用户删除自己的待玩游戏" ON game_todos
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (
      EXISTS (
        SELECT 1 FROM game_groups
        WHERE game_groups.id = game_todos.group_id
        AND game_groups.leader_id = auth.uid()
      )
    )
  );

-- 启用RLS
ALTER TABLE game_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_todos ENABLE ROW LEVEL SECURITY;

-- 添加索引提高查询性能
CREATE INDEX idx_game_todos_user_id ON game_todos(user_id);
CREATE INDEX idx_game_todos_group_id ON game_todos(group_id);
CREATE INDEX idx_game_todos_created_at ON game_todos(created_at);
CREATE INDEX idx_game_groups_leader_id ON game_groups(leader_id);
CREATE INDEX idx_game_group_members_group_id ON game_group_members(group_id);
CREATE INDEX idx_game_group_members_user_id ON game_group_members(user_id); 