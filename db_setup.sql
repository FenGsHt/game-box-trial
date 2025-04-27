--"��Ϸ����ϵͳ���ݿⴴ��SQL" 

-- ȷ��users����ڣ������δ������
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

-- ������Ϸ���Ա��Ѵ�������ԣ�
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'game_comments') THEN
    CREATE TABLE game_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      game_todo_id UUID NOT NULL,
      user_id UUID NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      -- ������Լ��
      CONSTRAINT fk_game_todo FOREIGN KEY (game_todo_id) REFERENCES game_todos(id) ON DELETE CASCADE
      -- ע�⣺�����user_id�����Լ������Ϊ���ǽ��ֶ��������ֹ�ϵ
    );
  END IF;
END $$;

-- ����RLS����
ALTER TABLE game_comments ENABLE ROW LEVEL SECURITY;

-- Ĭ�ϲ������κβ���
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

-- ��������֤�û��������ԣ�ͨ��Ȩ�ޣ�
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '��������֤�û���������' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "��������֤�û���������" ON game_comments 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (true);
  END IF;
END $$;

-- ����鿴��������:
-- 1. �Լ�������
-- 2. �Լ���������Ϸ�������
-- 3. �Լ��������Ϸ�������
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '����鿴�������' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "����鿴�������" ON game_comments 
      FOR SELECT 
      TO authenticated 
      USING (
        user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM game_todos gt 
          WHERE 
            gt.id = game_todo_id AND
            (
              -- �û��Լ�����Ϸ
              gt.user_id = auth.uid() OR 
              -- �û����������е���Ϸ
              EXISTS (
                SELECT 1 FROM game_groups gg 
                WHERE 
                  gg.id = gt.group_id AND 
                  gg.leader_id = auth.uid()
              ) OR 
              -- �û���������е���Ϸ
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

-- ����ɾ���Լ�������
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '����ɾ���Լ�������' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "����ɾ���Լ�������" ON game_comments 
      FOR DELETE 
      TO authenticated 
      USING (user_id = auth.uid());
  END IF;
END $$;

-- ����ɾ����Ϸ���鳤��ɾ��Ȩ��
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '������Ϸ���鳤ɾ����������' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "������Ϸ���鳤ɾ����������" ON game_comments 
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

-- ������������߲�ѯ���ܣ��Ѵ�������ԣ�
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

-- ȷ��game_todos������link, note, price�ֶΣ����û�������
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS price NUMERIC; 
