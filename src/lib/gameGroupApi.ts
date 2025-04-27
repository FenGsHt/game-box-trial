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
  const { data: members, error } = await supabase
    .from('game_group_members')
    .select(`
      id,
      group_id,
      user_id,
      joined_at
    `)
    .eq('group_id', groupId);

  if (error || !members) {
    return { data: null, error };
  }

  // 获取成员对应的用户信息
  const userIds = members.map(member => member.user_id);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, username')
    .in('id', userIds);
  
  // 合并数据
  const data = members.map(member => {
    const profile = profiles?.find(p => p.id === member.user_id);
    return {
      ...member,
      user: profile ? { email: profile.email, username: profile.username } : null
    };
  });

  return { data, error: null };
}

// 添加成员到游戏组
export async function addMemberToGroup(groupId: string, username: string) {
  try {
    // 检查自己是否是组长
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: { message: '您需要登录才能添加成员' } };
    }
    
    // 检查组是否存在以及当前用户是否是组长
    const { data: group } = await supabase
      .from('game_groups')
      .select('leader_id')
      .eq('id', groupId)
      .single();
      
    if (!group) {
      return { error: { message: '游戏组不存在' } };
    }
    
    if (group.leader_id !== user.id) {
      return { error: { message: '只有组长才能添加成员' } };
    }
    
    // 通过用户名查找用户（从profiles表）
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username)
      .maybeSingle();
      
    if (profileData && profileData.id) {
      // 添加到成员表
      const { data, error } = await supabase
        .from('game_group_members')
        .insert([{
          group_id: groupId,
          user_id: profileData.id
        }])
        .select();
        
      if (error) {
        if (error.code === '23505') {
          return { error: { message: '该用户已经是组成员' } };
        }
        return { error };
      }
      
      return { data };
    }
    
    // 如果找不到用户
    return { 
      error: { 
        message: '找不到该用户。请确认以下几点：\n1. 用户名拼写正确\n2. 该用户已注册并设置了用户名\n3. 用户在登录后已完成个人资料设置' 
      } 
    };
    
  } catch (error: unknown) {
    console.error('添加成员异常:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return { error: { message: `添加成员出错: ${errorMessage}` } };
  }
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