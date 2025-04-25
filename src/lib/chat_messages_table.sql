CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  

CREATE TABLE IF NOT EXISTS chat_messages (  
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
  content TEXT NOT NULL,  
  sender_id UUID NOT NULL,  -- Changed from TEXT to UUID
  sender_name TEXT NOT NULL,  
  created_at TIMESTAMPTZ DEFAULT NOW()  
);  

ALTER TABLE chat_messages REPLICA IDENTITY FULL;  

CREATE POLICY "允许已认证用户插入消息" ON chat_messages  
  FOR INSERT TO authenticated WITH CHECK (true);  

CREATE POLICY "允许所有用户读取消息" ON chat_messages  
  FOR SELECT TO anon, authenticated USING (true);  

CREATE POLICY "允许用户删除自己的消息." ON chat_messages  
  FOR DELETE TO authenticated USING (sender_id = auth.uid());  

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;  

CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);  
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);