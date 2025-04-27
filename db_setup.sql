--"游戏留言系统数据库创建SQL" 

-- 确保users表存在（如果尚未创建）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT,
      username TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- 创建游戏留言表（已创建则忽略）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'game_comments') THEN
    CREATE TABLE game_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      game_todo_id UUID NOT NULL,
      user_id UUID NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      -- 添加外键约束
      CONSTRAINT fk_game_todo FOREIGN KEY (game_todo_id) REFERENCES game_todos(id) ON DELETE CASCADE
      -- 注意：不添加user_id的外键约束，因为我们将手动处理这种关系
    );
  END IF;
END $$;

-- 创建游戏标签表（已创建则忽略）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'game_tags') THEN
    CREATE TABLE game_tags (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#3B82F6',
      creator_id UUID REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- 为game_todos表添加tags字段（如果尚未添加）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'game_todos' AND column_name = 'tags'
  ) THEN
    ALTER TABLE game_todos ADD COLUMN tags UUID[] DEFAULT '{}';
  END IF;
END $$;

-- 创建RLS策略
ALTER TABLE game_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_tags ENABLE ROW LEVEL SECURITY;

-- 为游戏留言表创建RLS策略
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'deny all' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "deny all" ON game_comments 
      FOR ALL 
      USING (false);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许已认证用户创建留言' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "允许已认证用户创建留言" ON game_comments 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许查看相关留言' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "允许查看相关留言" ON game_comments 
      FOR SELECT 
      TO authenticated 
      USING (
        user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM game_todos gt 
          WHERE 
            gt.id = game_todo_id AND
            (
              -- 用户自己的游戏
              gt.user_id = auth.uid() OR 
              -- 用户创建的组中的游戏
              EXISTS (
                SELECT 1 FROM game_groups gg 
                WHERE 
                  gg.id = gt.group_id AND 
                  gg.leader_id = auth.uid()
              ) OR 
              -- 用户参与的组中的游戏
              EXISTS (
                SELECT 1 FROM game_group_members ggm 
                WHERE 
                  ggm.group_id = gt.group_id AND 
                  ggm.user_id = auth.uid()
              )
            )
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许删除自己的留言' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "允许删除自己的留言" ON game_comments 
      FOR DELETE 
      TO authenticated 
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许游戏组组长删除组内留言' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "允许游戏组组长删除组内留言" ON game_comments 
      FOR DELETE 
      TO authenticated 
      USING (
        EXISTS (
          SELECT 1 FROM game_todos gt 
          JOIN game_groups gg ON gt.group_id = gg.id
          WHERE 
            gt.id = game_todo_id AND
            gg.leader_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 为游戏标签表创建RLS策略
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许查看所有标签' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "允许查看所有标签" ON game_tags
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许创建标签' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "允许创建标签" ON game_tags
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许更新自己创建的标签' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "允许更新自己创建的标签" ON game_tags
      FOR UPDATE
      TO authenticated
      USING (creator_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '允许删除自己创建的标签' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "允许删除自己创建的标签" ON game_tags
      FOR DELETE
      TO authenticated
      USING (creator_id = auth.uid());
  END IF;
END $$;

-- 创建索引以提高查询性能（已存在则忽略）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'game_comments' AND indexname = 'game_comments_game_todo_id_idx'
  ) THEN
    CREATE INDEX game_comments_game_todo_id_idx ON game_comments (game_todo_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'game_comments' AND indexname = 'game_comments_user_id_idx'
  ) THEN
    CREATE INDEX game_comments_user_id_idx ON game_comments (user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'game_comments' AND indexname = 'game_comments_created_at_idx'
  ) THEN
    CREATE INDEX game_comments_created_at_idx ON game_comments (created_at);
  END IF;
END $$;

-- 为标签表创建索引
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'game_tags' AND indexname = 'game_tags_creator_id_idx'
  ) THEN
    CREATE INDEX game_tags_creator_id_idx ON game_tags (creator_id);
  END IF;
END $$;

-- 确保game_todos表中有link, note, price字段，如果没有则添加
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS price NUMERIC; 
