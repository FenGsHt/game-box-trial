import { supabase } from './supabase';

// 获取用户组内未评分的游戏数量
export async function getUnratedGroupGamesCount() {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      return 0;
    }
    
    // 查询用户加入的组
    const { data: groupIds, error: groupError } = await supabase
      .from('game_group_members')
      .select('group_id')
      .eq('user_id', user.user.id);
    
    if (groupError || !groupIds || groupIds.length === 0) {
      console.error('获取用户组失败或用户没有加入任何组:', groupError);
      return 0;
    }
    
    const groupIdArray = groupIds.map(item => item.group_id);
    
    // 查询组内所有游戏
    const { data: groupGames, error: gamesError } = await supabase
      .from('game_todos')
      .select('id')
      .in('group_id', groupIdArray);
    
    if (gamesError || !groupGames || groupGames.length === 0) {
      console.error('获取组内游戏失败或组内没有游戏:', gamesError);
      return 0;
    }
    
    const gameIds = groupGames.map(game => game.id);
    
    // 查询用户已经评分的游戏
    const { data: ratedGames, error: ratedError } = await supabase
      .from('game_ratings')
      .select('game_todo_id')
      .eq('user_id', user.user.id)
      .in('game_todo_id', gameIds);
    
    if (ratedError) {
      console.error('获取用户已评分游戏失败:', ratedError);
      return 0;
    }
    
    // 用户已评分的游戏ID集合
    const ratedGameIds = new Set(ratedGames?.map(game => game.game_todo_id) || []);
    
    // 计算未评分的游戏数量
    const unratedCount = gameIds.filter(id => !ratedGameIds.has(id)).length;
    
    return unratedCount;
  } catch (error) {
    console.error('获取未评分游戏数量异常:', error);
    return 0;
  }
}

// 获取未读的待玩游戏数量
export async function getUnreadTodosCount() {
  return getUnratedGroupGamesCount();
}

// 更新待玩游戏为已读 - 现在是空函数，因为我们基于未评分状态来展示通知
export async function markTodosAsViewed() {
  // 不再需要标记游戏为已读，因为通知是基于未评分状态
  return;
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