-- 删除原有的游戏组查看策略
DROP POLICY IF EXISTS "允许用户查看自己创建的组" ON game_groups;

-- 创建新的查看策略，允许用户查看自己创建的组或加入的组
CREATE POLICY "允许用户查看相关组" ON game_groups
  FOR SELECT
  TO authenticated
  USING (
    leader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM game_group_members
      WHERE game_group_members.group_id = game_groups.id
      AND game_group_members.user_id = auth.uid()
    )
  );

-- 创建策略仍然保持不变，只有用户可以创建组并成为组长
-- 但我们需要确保组长ID是当前用户
CREATE POLICY IF NOT EXISTS "允许用户创建组" ON game_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (leader_id = auth.uid());

-- 删除原有更新策略
DROP POLICY IF EXISTS "允许组长更新组信息" ON game_groups;

-- 创建新的更新策略，允许组长或组成员更新组信息
CREATE POLICY "允许组内成员更新组信息" ON game_groups
  FOR UPDATE
  TO authenticated
  USING (
    leader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM game_group_members
      WHERE game_group_members.group_id = game_groups.id
      AND game_group_members.user_id = auth.uid()
    )
  );

-- 删除策略保持不变，只有组长可以删除组
-- 确保删除策略存在
CREATE POLICY IF NOT EXISTS "允许组长删除组" ON game_groups
  FOR DELETE
  TO authenticated
  USING (leader_id = auth.uid()); 