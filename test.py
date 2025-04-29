import requests  
import re
from bs4 import BeautifulSoup  
import json
import os

def get_appid_by_name(game_name):  
    search_url = f"https://store.steampowered.com/search/?term={game_name.replace(' ', '+')}"  
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}  
    resp = requests.get(search_url, headers=headers, timeout=10)  
    soup = BeautifulSoup(resp.text, "html.parser")  
    a_tag = soup.find("a", class_="search_result_row")  
    if a_tag:  
        link = a_tag['href']  
        appid = link.split('/app/')[1].split('/')[0]  
        return appid  
    else:  
        return None  

def get_header_img_url(appid):  
    return f"https://cdn.akamai.steamstatic.com/steam/apps/{appid}/header.jpg"  

def get_game_preview_images(appid):
    # 获取Steam游戏预览页面数据
    preview_url = f"https://store.steampowered.com/apphoverpublic/{appid}?review_score_preference=0&l=schinese&origin=https%3A%2F%2Fstore.steampowered.com&pagev6=true"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://store.steampowered.com/"
    }
    
    try:
        resp = requests.get(preview_url, headers=headers, timeout=10)
        resp.raise_for_status()
        
        # 使用正则表达式查找所有预览图片URL
        pattern = r'https://shared\.fastly\.steamstatic\.com/store_item_assets/steam/apps/\d+/[^"\']+\.(?:jpg|png|jpeg)[^"\'\s]*'
        image_urls = re.findall(pattern, resp.text)
        
        # 确保URL是唯一的
        unique_urls = list(set(image_urls))
        
        # 过滤只保留截图（通常包含"ss_"）
        screenshot_urls = [url for url in unique_urls if "ss_" in url]
        
        # 如果没有找到截图，则返回所有图片
        if not screenshot_urls:
            return unique_urls
        
        return screenshot_urls
    except Exception as e:
        print(f"获取游戏预览图片失败: {e}")
        return []

def download_image(url, save_path):  
    resp = requests.get(url, stream=True)  
    if resp.status_code == 200:  
        with open(save_path, 'wb') as f:  
            for chunk in resp.iter_content(1024):  
                f.write(chunk)  
        print(f"图片已保存到: {save_path}")
        return True
    else:  
        print(f"图片获取失败! 状态码: {resp.status_code}")
        return False

def download_preview_images(appid, game_name, max_images=3):
    # 创建目录保存图片
    game_dir = f"{game_name}_images"
    os.makedirs(game_dir, exist_ok=True)
    
    # 下载封面图
    header_url = get_header_img_url(appid)
    header_path = os.path.join(game_dir, f"{game_name}_header.jpg")
    header_success = download_image(header_url, header_path)
    
    # 获取预览图
    preview_urls = get_game_preview_images(appid)
    downloaded_count = 0
    
    if preview_urls:
        print(f"找到 {len(preview_urls)} 张预览图片")
        for i, url in enumerate(preview_urls[:max_images]):
            # 提取文件名
            filename = url.split('/')[-1].split('?')[0]
            save_path = os.path.join(game_dir, f"{game_name}_preview_{i+1}_{filename}")
            success = download_image(url, save_path)
            if success:
                downloaded_count += 1
    else:
        print("未找到预览图片")
    
    return {
        "header": header_path if header_success else None,
        "preview_count": downloaded_count,
        "preview_urls": preview_urls[:max_images] if preview_urls else []
    }

if __name__ == "__main__":  
    game_name = input("请输入游戏名：").strip()  
    appid = get_appid_by_name(game_name)  
    if not appid:  
        print("未找到对应的Steam游戏！")  
    else:  
        print(f"{game_name} 的AppID是：{appid}")  
        
        # 下载游戏图片
        result = download_preview_images(appid, game_name)
        
        if result["header"]:
            print(f"封面图片已保存到: {result['header']}")
        
        if result["preview_count"] > 0:
            print(f"已下载 {result['preview_count']} 张预览图片")
            print("预览图片URL:")
            for url in result["preview_urls"]:
                print(f"  - {url}")
        else:
            print("未能下载任何预览图片")