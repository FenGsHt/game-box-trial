import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 获取游戏名称参数
    const { searchParams } = new URL(request.url);
    const gameName = searchParams.get('game');
    
    if (!gameName) {
      return NextResponse.json({ error: '缺少游戏名称参数' }, { status: 400 });
    }
    
    // 构建搜索URL
    const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
    
    // 发送请求获取搜索结果页面
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // 使用正则表达式从HTML中提取appId
    const appIdMatch = html.match(/href="https:\/\/store\.steampowered\.com\/app\/(\d+)/);
    if (!appIdMatch || !appIdMatch[1]) {
      return NextResponse.json({ 
        error: '未找到对应的Steam游戏',
        imageUrl: null 
      });
    }
    
    const appId = appIdMatch[1];
    console.log(`${gameName} 的AppID是：${appId}`);
    
    // 构建图片URL
    const imageUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
    
    // 验证图片URL是否可访问
    const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
    
    if (imageResponse.ok) {
      return NextResponse.json({ imageUrl });
    } else {
      // 如果图片URL无法访问，返回一个默认图片
      return NextResponse.json({ 
        imageUrl: `https://placehold.co/640x320/eee/999?text=${encodeURIComponent(gameName)}`,
        note: '无法访问Steam图片' 
      });
    }
  } catch (error) {
    console.error('获取Steam游戏图片URL失败:', error);
    return NextResponse.json(
      { error: '获取Steam游戏图片失败', message: (error as Error).message }, 
      { status: 500 }
    );
  }
} 