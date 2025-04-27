import { supabase } from './supabase';

// 游戏组类型
export interface GameGroup {
  id: string;
  name: string;
  description: string | null;
  leader_id: string;
  created_at: string;
}

// 游戏组成员类型
export interface GameGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  user?: { email: string; username?: string }; // 用于关联查询
}

// 创建游戏组
export async function createGameGroup(name: string, description?: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: { message: '用户未登录' } };

  const { data, error } = await supabase
    .from('game_groups')
    .insert([
      {
        name,
        description,
        leader_id: user.user.id,
      }
    ])
    .select()
    .single();

  return { data, error };
}

// 获取用户创建的游戏组
export async function getUserCreatedGroups() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: [], error: null };

  const { data, error } = await supabase
    .from('game_groups')
    .select('*')
    .eq('leader_id', user.user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

// 获取用户加入的游戏组
export async function getUserJoinedGroups() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: [], error: null };

  const { data, error } = await supabase
    .from('game_group_members')
    .select(`
      group_id,
      game_groups (*)
    `)
    .eq('user_id', user.user.id);

  // 重新格式化数据
  const groups = data?.map(item => item.game_groups) || [];
  
  return { data: groups, error };
}

// 获取游戏组详情
export async function getGameGroupDetails(groupId: string) {
  const { data, error } = await supabase
    .from('game_groups')
    .select('*')
    .eq('id', groupId)
    .single();

  return { data, error };
}

// 获取游戏组成员
export async function getGameGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('game_group_members')
    .select(`
      id,
      group_id,
      user_id,
      joined_at,
      user:user_id (email)
    `)
    .eq('group_id', groupId);

  return { data, error };
}

// 添加成员到游戏组
export async function addMemberToGroup(groupId: string, userEmail: string) {
  // 首先查找该用户
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (userError || !users) {
    return { error: { message: '找不到该用户' } };
  }

  // 添加用户到组
  const { data, error } = await supabase
    .from('game_group_members')
    .insert([
      {
        group_id: groupId,
        user_id: users.id,
      }
    ]);

  return { data, error };
}

// 从游戏组移除成员
export async function removeMemberFromGroup(memberId: string) {
  const { data, error } = await supabase
    .from('game_group_members')
    .delete()
    .eq('id', memberId);

  return { data, error };
}

// 更新游戏组信息
export async function updateGameGroup(groupId: string, data: { name?: string; description?: string }) {
  const { data: result, error } = await supabase
    .from('game_groups')
    .update(data)
    .eq('id', groupId);

  return { data: result, error };
}

// 删除游戏组
export async function deleteGameGroup(groupId: string) {
  const { data, error } = await supabase
    .from('game_groups')
    .delete()
    .eq('id', groupId);

  return { data, error };
} 