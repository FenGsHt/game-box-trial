# Supabase实时聊天功能实现指南

## 架构概述

这个实时聊天功能基于Supabase的实时订阅功能实现。主要包含以下部分：

1. **数据库表设计** - 创建chat_messages表存储聊天记录
2. **API服务层** - 封装与Supabase的交互
3. **UI组件** - 聊天窗口界面实现
4. **实时订阅** - 使用Supabase的实时功能更新聊天消息

## 数据库设置

在Supabase中需要创建`chat_messages`表并设置适当的权限：

```sql
-- 创建聊天消息表
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用实时功能
ALTER TABLE chat_messages REPLICA IDENTITY FULL;

-- 设置行级安全策略
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 创建权限策略
CREATE POLICY "允许所有用户读取消息" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "允许已认证用户发送消息" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
```

## API服务层

API服务层提供了以下功能：

1. 获取历史消息
2. 发送新消息
3. 订阅实时消息更新

```typescript
// src/lib/chatApi.ts 中定义的主要函数：

// 获取历史消息
export async function fetchChatMessages(limit = 50): Promise<ChatMessage[]>

// 发送新消息
export async function sendChatMessage(content: string, sender_id: string, sender_name: string): Promise<ChatMessage | null>

// 订阅新消息
export function subscribeToChatMessages(callback: (message: ChatMessage) => void): () => void
```

## 使用方法

### 1. 初始化聊天组件

```tsx
<ChatWindow isOpen={isOpen} onClose={handleClose} />
```

### 2. 消息加载与订阅

聊天组件会在打开时：
- 加载历史消息
- 设置实时订阅以接收新消息

```tsx
useEffect(() => {
  if (isOpen) {
    // 加载历史消息
    fetchChatMessages().then(data => setMessages([welcomeMessage, ...data]));
    
    // 订阅新消息
    const unsubscribe = subscribeToChatMessages(newMsg => {
      setMessages(current => [...current, newMsg]);
    });
    
    return unsubscribe; // 组件卸载时取消订阅
  }
}, [isOpen]);
```

### 3. 发送消息

```tsx
const handleSendMessage = async () => {
  await sendChatMessage(
    messageContent,
    userId,
    userName
  );
};
```

## 注意事项

1. **实时更新配置**：确保Supabase项目已启用实时功能
2. **权限设置**：检查RLS策略是否正确配置
3. **并发处理**：添加适当的状态和错误处理机制
4. **性能优化**：对于高流量聊天，考虑分页加载和消息缓存

## 排错指南

1. 消息未实时更新：检查Supabase实时功能是否已启用
2. 权限错误：验证RLS策略和用户认证状态
3. 数据不一致：确保使用正确的表结构和索引 