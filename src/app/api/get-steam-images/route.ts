import { NextResponse } from 'next/server';

// 添加GET请求处理，用于测试API是否正常工作
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Steam游戏图片API正常工作中。请使用POST请求，并在请求体中提供game_name参数。" 
  });
}

export async function POST(request: Request) {
  try {
    // 解析请求体获取游戏名称
    let game_name;
    try {
      const body = await request.json();
      game_name = body.game_name;
    } catch (error) {
      console.error('解析请求体失败:', error);
      return NextResponse.json({ error: '无效的请求体格式' }, { status: 400 });
    }
    
    if (!game_name) {
      return NextResponse.json({ error: '缺少游戏名称参数' }, { status: 400 });
    }
    
    console.log(`正在处理游戏图片请求: ${game_name}`);
    
    // 步骤1: 根据游戏名称搜索获取AppID
    const appId = await getAppIdByGameName(game_name);
    
    if (!appId) {
      console.log(`未找到Steam游戏: ${game_name}`);
      return NextResponse.json({ 
        error: '未找到对应的Steam游戏',
        header_url: null,
        preview_urls: [] 
      });
    }
    
    console.log(`找到游戏AppID: ${appId}`);
    
    // 步骤2: 获取游戏封面
    const headerUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
    
    // 步骤3: 获取游戏预览图片
    const previewUrls = await getGamePreviewImages(appId);
    console.log(`获取到${previewUrls.length}张预览图片`);
    
    return NextResponse.json({
      appId,
      header_url: headerUrl,
      preview_urls: previewUrls
    });
  } catch (error) {
    console.error('获取Steam游戏图片失败:', error);
    return NextResponse.json(
      { error: '获取Steam游戏图片失败', message: (error as Error).message }, 
      { status: 500 }
    );
  }
}

// 根据游戏名称获取Steam AppID
async function getAppIdByGameName(gameName: string): Promise<string | null> {
  try {
    const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    };
    
    console.log(`正在请求Steam搜索: ${searchUrl}`);
    const response = await fetch(searchUrl, { 
      headers,
      cache: 'no-store',
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // 使用正则表达式从搜索结果中提取AppID
    const appIdMatch = html.match(/href="https:\/\/store\.steampowered\.com\/app\/(\d+)/);
    if (!appIdMatch || !appIdMatch[1]) {
      return null;
    }
    
    return appIdMatch[1];
  } catch (error) {
    console.error('获取Steam AppID失败:', error);
    return null;
  }
}

// 获取游戏预览图片URLs
async function getGamePreviewImages(appId: string): Promise<string[]> {
  try {
    console.log('直接使用hover API获取预览图片');
    return await getImagesFromHoverApi(appId);
  } catch (error) {
    console.error('获取游戏预览图片失败:', error);
    return [];
  }
}

// 备用方法：从hover API获取图片
async function getImagesFromHoverApi(appId: string): Promise<string[]> {
  try {
    const previewUrl = `https://store.steampowered.com/apphoverpublic/${appId}?review_score_preference=0&l=schinese&origin=https%3A%2F%2Fstore.steampowered.com&pagev6=true`;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Referer": "https://store.steampowered.com/"
    };
    
    console.log(`请求Steam hover API: ${previewUrl}`);
    const response = await fetch(previewUrl, { 
      headers,
      cache: 'no-store',
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    // console.log(html);
    
    // 使用多种模式匹配以提高成功率
    const pattern = /https:\/\/[\w.-]+\/store_item_assets\/steam\/apps\/\d+\/ss_[^"'\s]+\.(?:jpg|png|jpeg)[^"'\s]*/g;  
    
    let allMatches: string[] = [];
    const matches = html.match(pattern) || [];
    allMatches = [...allMatches, ...matches];
    
    // 确保URL是唯一的
    const uniqueUrls = [...new Set(allMatches)];
    console.log(`从hover API找到 ${uniqueUrls.length} 张预览图片`);
    
    return uniqueUrls.slice(0, 5); // 只返回最多5张图片
  } catch (error) {
    console.error('从hover API获取图片失败:', error);
    return [];
  }
} 