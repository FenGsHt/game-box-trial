// 对于没有Supabase Edge Functions的情况，这里创建一个替代函数
export const invokeSteamImagesApi = async (gameName: string) => {
  try {
    console.log(`调用API获取游戏图片: ${gameName}`);
    
    // 先尝试GET请求测试API是否可用
    try {
      const testResponse = await fetch('/api/get-steam-images', {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(5000) // 5秒超时
      });
      
      if (!testResponse.ok) {
        console.warn(`API测试请求失败: ${testResponse.status}`);
      } else {
        console.log('API测试请求成功');
      }
    } catch (testError) {
      console.warn('API测试请求失败:', testError);
    }
    
    // 然后执行实际的POST请求
    const response = await fetch('/api/get-steam-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game_name: gameName }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000) // 15秒超时
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API请求成功, 获取到${data.preview_urls?.length || 0}张预览图片`);
    return data;
  } catch (error) {
    console.error('调用Steam图片API失败:', error);
    
    // 尝试直接获取封面图作为备用方案
    try {
      console.log('尝试备用方法获取封面图');
      const fallbackImageUrl = await getFallbackImageUrl(gameName);
      return { 
        error: '获取完整图片集失败',
        header_url: fallbackImageUrl,
        preview_urls: []
      };
    } catch (fallbackError) {
      console.error('备用方法也失败:', fallbackError);
      return { 
        error: '获取游戏图片完全失败',
        header_url: null,
        preview_urls: []
      };
    }
  }
};

// 备用方法：直接构建封面图URL
async function getFallbackImageUrl(gameName: string): Promise<string | null> {
  try {
    // 简单的搜索请求获取AppID
    const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      signal: AbortSignal.timeout(8000) // 8秒超时
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    const appIdMatch = html.match(/href="https:\/\/store\.steampowered\.com\/app\/(\d+)/);
    if (!appIdMatch || !appIdMatch[1]) return null;
    
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appIdMatch[1]}/header.jpg`;
  } catch (error) {
    console.error('备用图片获取失败:', error);
    return null;
  }
} 