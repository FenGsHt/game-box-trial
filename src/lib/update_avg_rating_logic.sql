-- 修改计算游戏平均分的函数，让未评分的用户默认按1星计算
CREATE OR REPLACE FUNCTION update_game_avg_rating()
RETURNS TRIGGER AS $$
DECLARE
    total_users INT;
    rated_users INT;
    avg_rated_score NUMERIC(2,1);
    todo_group_id UUID;
    final_avg_score NUMERIC(2,1);
    game_id UUID;
BEGIN
    -- 获取触发器中涉及的游戏ID
    game_id := CASE
        WHEN TG_OP = 'DELETE' THEN OLD.game_todo_id
        ELSE NEW.game_todo_id
    END;
    
    -- 获取游戏所属的组ID(如果有)
    SELECT group_id INTO todo_group_id
    FROM game_todos
    WHERE id = game_id;
    
    -- 如果不属于任何组，使用普通的平均分计算
    IF todo_group_id IS NULL THEN
        UPDATE game_todos
        SET avg_rating = COALESCE((
            SELECT AVG(rating)
            FROM game_ratings
            WHERE game_todo_id = game_id
        ), 0)
        WHERE id = game_id;
    ELSE
        -- 获取组内总用户数
        SELECT COUNT(*) INTO total_users
        FROM game_group_members
        WHERE group_id = todo_group_id;
        
        -- 获取已评分用户数和他们的评分总和
        SELECT COUNT(*), COALESCE(AVG(gr.rating), 0) 
        INTO rated_users, avg_rated_score
        FROM game_ratings gr
        JOIN game_group_members ggm ON gr.user_id = ggm.user_id
        WHERE gr.game_todo_id = game_id
        AND ggm.group_id = todo_group_id;
        
        -- 计算最终平均分，未评分用户算作1星
        -- 最终平均分 = (已评分用户平均分 * 已评分用户数 + 1 * 未评分用户数) / 总用户数
        IF total_users > 0 THEN
            final_avg_score := (avg_rated_score * rated_users + 1 * (total_users - rated_users)) / total_users;
        ELSE
            final_avg_score := 0;
        END IF;
        
        -- 更新游戏的平均分
        UPDATE game_todos
        SET avg_rating = final_avg_score
        WHERE id = game_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 重新计算所有游戏的平均分
DO $$
DECLARE
    game_rec RECORD;
    total_users INT;
    rated_users INT;
    avg_rated_score NUMERIC(2,1);
    final_avg_score NUMERIC(2,1);
BEGIN
    -- 遍历所有属于组的游戏
    FOR game_rec IN 
        SELECT gt.id, gt.group_id
        FROM game_todos gt
        WHERE gt.group_id IS NOT NULL
    LOOP
        -- 获取组内总用户数
        SELECT COUNT(*) INTO total_users
        FROM game_group_members
        WHERE group_id = game_rec.group_id;
        
        -- 获取已评分用户数和他们的评分平均值
        SELECT COUNT(*), COALESCE(AVG(gr.rating), 0) 
        INTO rated_users, avg_rated_score
        FROM game_ratings gr
        JOIN game_group_members ggm ON gr.user_id = ggm.user_id
        WHERE gr.game_todo_id = game_rec.id
        AND ggm.group_id = game_rec.group_id;
        
        -- 计算最终平均分，未评分用户算作1星
        IF total_users > 0 THEN
            final_avg_score := (avg_rated_score * rated_users + 1 * (total_users - rated_users)) / total_users;
        ELSE
            final_avg_score := 0;
        END IF;
        
        -- 更新游戏的平均分
        UPDATE game_todos
        SET avg_rating = final_avg_score
        WHERE id = game_rec.id;
    END LOOP;
    
    -- 更新不属于组的游戏的平均分
    UPDATE game_todos
    SET avg_rating = COALESCE((
        SELECT AVG(rating)
        FROM game_ratings
        WHERE game_ratings.game_todo_id = game_todos.id
    ), 0)
    WHERE group_id IS NULL;
END $$; 