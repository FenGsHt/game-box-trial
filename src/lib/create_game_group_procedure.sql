-- 创建一个存储过程，用于创建游戏组并同时将创建者添加为组成员
CREATE OR REPLACE FUNCTION create_game_group_with_leader(
  p_name TEXT,
  p_description TEXT,
  p_leader_id UUID
) RETURNS json AS $$
DECLARE
  v_group_id UUID;
  v_created_group RECORD;
BEGIN
  -- 首先创建游戏组
  INSERT INTO game_groups (name, description, leader_id)
  VALUES (p_name, p_description, p_leader_id)
  RETURNING id INTO v_group_id;
  
  -- 然后将创建者添加为组成员
  INSERT INTO game_group_members (group_id, user_id)
  VALUES (v_group_id, p_leader_id);
  
  -- 获取创建的游戏组详情
  SELECT * INTO v_created_group 
  FROM game_groups
  WHERE id = v_group_id;
  
  -- 返回创建的游戏组信息
  RETURN to_json(v_created_group);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '创建游戏组失败: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 