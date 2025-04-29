import requests  
from bs4 import BeautifulSoup  

def get_appid_by_name(game_name):  
    search_url = f"https://store.steampowered.com/search/?term={game_name.replace(' ', '+')}"  
    headers = {"User-Agent": "Mozilla/5.0"}  
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

def download_image(url, save_path):  
    resp = requests.get(url, stream=True)  
    if resp.status_code == 200:  
        with open(save_path, 'wb') as f:  
            for chunk in resp.iter_content(1024):  
                f.write(chunk)  
        print(f"图片已保存到: {save_path}")  
    else:  
        print("图片获取失败！")  

if __name__ == "__main__":  
    game_name = input("请输入游戏名：").strip()  
    appid = get_appid_by_name(game_name)  
    if not appid:  
        print("未找到对应的Steam游戏！")  
    else:  
        print(f"{game_name} 的AppID是：{appid}")  
        img_url = get_header_img_url(appid)  
        print(f"封面图片URL为：{img_url}")  
        # 可选：自动下载图片  
        save_file = f"{game_name}_header.jpg"  
        download_image(img_url, save_file)  