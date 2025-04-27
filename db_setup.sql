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

-- ������Ϸ��ǩ���Ѵ�������ԣ�
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

-- Ϊgame_todos�����tags�ֶΣ������δ��ӣ�
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'game_todos' AND column_name = 'tags'
  ) THEN
    ALTER TABLE game_todos ADD COLUMN tags UUID[] DEFAULT '{}';
  END IF;
END $$;

-- ����RLS����
ALTER TABLE game_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_tags ENABLE ROW LEVEL SECURITY;

-- Ϊ��Ϸ���Ա���RLS����
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
    SELECT 1 FROM pg_policies WHERE policyname = '��������֤�û���������' AND tablename = 'game_comments'
  ) THEN
    CREATE POLICY "��������֤�û���������" ON game_comments 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (true);
  END IF;
END $$;

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

-- Ϊ��Ϸ��ǩ����RLS����
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '����鿴���б�ǩ' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "����鿴���б�ǩ" ON game_tags
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '��������ǩ' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "��������ǩ" ON game_tags
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '��������Լ������ı�ǩ' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "��������Լ������ı�ǩ" ON game_tags
      FOR UPDATE
      TO authenticated
      USING (creator_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '����ɾ���Լ������ı�ǩ' AND tablename = 'game_tags'
  ) THEN
    CREATE POLICY "����ɾ���Լ������ı�ǩ" ON game_tags
      FOR DELETE
      TO authenticated
      USING (creator_id = auth.uid());
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

-- Ϊ��ǩ��������
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'game_tags' AND indexname = 'game_tags_creator_id_idx'
  ) THEN
    CREATE INDEX game_tags_creator_id_idx ON game_tags (creator_id);
  END IF;
END $$;

-- ȷ��game_todos������link, note, price�ֶΣ����û�������
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE game_todos ADD COLUMN IF NOT EXISTS price NUMERIC; 
