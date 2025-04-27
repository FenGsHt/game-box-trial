-- 删除原有策略
DROP POLICY IF EXISTS "允许用户更新自己的待玩游戏" ON game_todos;

-- 创建新策略，允许用户更新自己的待玩游戏或所属组内的待玩游戏
CREATE POLICY "允许用户更新组内待玩游戏" ON game_todos
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM game_group_members
      WHERE game_group_members.group_id = game_todos.group_id
      AND game_group_members.user_id = auth.uid()
    )
  );

-- 同样更新删除策略，保持一致性
DROP POLICY IF EXISTS "允许用户删除自己的待玩游戏" ON game_todos;

CREATE POLICY "允许用户删除组内待玩游戏" ON game_todos
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM game_group_members
      WHERE game_group_members.group_id = game_todos.group_id
      AND game_group_members.user_id = auth.uid()
    )
  ); 