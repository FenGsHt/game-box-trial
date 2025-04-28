-- 创建 exec_sql 函数
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
  RETURN jsonb_build_object('status', 'success');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('status', 'error', 'message', SQLERRM);
END;
$$;

-- 为 game_todos 表添加 is_viewed 字段（如果尚未添加）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'game_todos' AND column_name = 'is_viewed'
  ) THEN
    ALTER TABLE game_todos ADD COLUMN is_viewed BOOLEAN DEFAULT FALSE;
  END IF;
END $$; 