import { supabase } from './supabase'

// 聊天消息类型
export interface ChatMessage {
  id: string
  content: string
  sender_id: string
  sender_name: string
  created_at: string
}

/**
 * 获取聊天历史消息
 * @param limit 限制返回的消息数量
 * @returns 聊天消息数组
 */
export async function fetchChatMessages(limit = 50): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit)
  
  if (error) {
    console.error('获取聊天消息失败:', error)
    return []
  }
  
  return data || []
}

/**
 * 发送聊天消息
 * @param content 消息内容
 * @param sender_id 发送者ID
 * @param sender_name 发送者名称
 * @returns 发送的消息或null(如果发送失败)
 */
export async function sendChatMessage(
  content: string,
  sender_id: string,
  sender_name: string
): Promise<ChatMessage | null> {
  // 确保sender_id是有效的UUID格式
  let finalSenderId = sender_id;
  if (sender_id === 'guest' || !sender_id) {
    // 为游客生成一个UUID
    finalSenderId = crypto.randomUUID();
  }
  
  const messageToSend = {
    content,
    sender_id: finalSenderId,
    sender_name,
    created_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([messageToSend])
    .select()
  
  if (error) {
    console.error('发送消息失败:', error)
    return null
  }
  
  return data?.[0] || null
}

/**
 * 删除聊天消息
 * @param id 要删除的消息ID
 * @returns 是否删除成功
 */
export async function deleteChatMessage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('删除消息失败:', error)
    return false
  }
  
  return true
}

/**
 * 订阅聊天消息更新
 * @param callback 当有新消息时的回调函数
 * @returns 用于取消订阅的函数
 */
export function subscribeToChatMessages(
  callback: (message: ChatMessage) => void
): () => void {
  const subscription = supabase
    .channel('chat_messages')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages' 
      }, 
      (payload) => {
        const newMessage = payload.new as ChatMessage
        callback(newMessage)
      }
    )
    .subscribe()
  
  // 返回取消订阅的函数
  return () => {
    subscription.unsubscribe()
  }
} 