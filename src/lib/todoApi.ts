import { supabase } from './supabase';

// 获取未读的待玩游戏数量
export async function getUnreadTodosCount() {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      return 0;
    }
    
    // 获取最近7天内添加的、未被当前用户查看的待玩游戏
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // 查询个人未读游戏
    const { data: personalData, error: personalError } = await supabase
      .from('game_todos')
      .select('id')
      .eq('user_id', user.user.id)
      .is('group_id', null)
      .eq('is_viewed', false)
      .gte('created_at', sevenDaysAgo.toISOString());
    
    if (personalError) {
      console.error('获取个人未读待玩游戏失败:', personalError);
      return 0;
    }
    
    // 查询用户加入的组的未读游戏
    const { data: groupIds, error: groupError } = await supabase
      .from('game_group_members')
      .select('group_id')
      .eq('user_id', user.user.id);
    
    if (groupError) {
      console.error('获取用户组失败:', groupError);
      return personalData?.length || 0;
    }
    
    let groupUnreadCount = 0;
    
    if (groupIds && groupIds.length > 0) {
      const groupIdArray = groupIds.map(item => item.group_id);
      
      const { data: groupData, error: groupDataError } = await supabase
        .from('game_todos')
        .select('id')
        .in('group_id', groupIdArray)
        .neq('user_id', user.user.id) // 不包括自己创建的
        .eq('is_viewed', false)
        .gte('created_at', sevenDaysAgo.toISOString());
      
      if (!groupDataError) {
        groupUnreadCount = groupData?.length || 0;
      }
    }
    
    return (personalData?.length || 0) + groupUnreadCount;
  } catch (error) {
    console.error('获取未读待玩游戏数量异常:', error);
    return 0;
  }
}

// 更新待玩游戏为已读
export async function markTodosAsViewed() {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      return;
    }
    
    // 更新个人待玩游戏为已读
    await supabase
      .from('game_todos')
      .update({ is_viewed: true })
      .eq('user_id', user.user.id)
      .is('group_id', null)
      .eq('is_viewed', false);
    
    // 查询用户加入的组
    const { data: groupIds } = await supabase
      .from('game_group_members')
      .select('group_id')
      .eq('user_id', user.user.id);
    
    if (groupIds && groupIds.length > 0) {
      const groupIdArray = groupIds.map(item => item.group_id);
      
      // 更新组内待玩游戏为已读
      await supabase
        .from('game_todos')
        .update({ is_viewed: true })
        .in('group_id', groupIdArray)
        .neq('user_id', user.user.id)
        .eq('is_viewed', false);
    }
  } catch (error) {
    console.error('标记待玩游戏为已读失败:', error);
  }
}

// 添加获取Steam游戏封面图片URL的函数
export async function getSteamGameImageUrl(gameName: string) {
  try {
    // 使用服务端API来处理请求，避免跨域问题
    const response = await fetch(`/api/get-steam-image?game=${encodeURIComponent(gameName)}`);
    
    if (!response.ok) {
      throw new Error(`API error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.imageUrl) {
      console.log(`未找到对应的Steam游戏: ${gameName}`);
      return null;
    }
    
    console.log(`${gameName} 的封面图片URL为：${data.imageUrl}`);
    return data.imageUrl;
  } catch (error) {
    console.error('获取Steam游戏图片URL失败:', error);
    return null;
  }
} 