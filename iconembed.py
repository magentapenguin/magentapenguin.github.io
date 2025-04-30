import requests, bs4, json, os, secrets, mimetypes, urllib.parse

os.chdir(os.path.dirname(__file__))

def find_icon(icon_url, prefered_size=64):
    """
    Find the icon from the given URL.
    :param icon_url: The URL of the icon.
    :param prefered_size: The preferred size of the icon.
    :return: The icon URL.
    """
    try:
        response = requests.get(icon_url, timeout=5)
        soup = bs4.BeautifulSoup(response.text, 'html.parser')
        icons = soup.find_all('link', rel='icon')
        if not icons:
            icons = soup.find_all('link', rel='shortcut icon')
        if not icons:
            icons = soup.find_all('link', rel='apple-touch-icon')
        valid_icons = {icon['href']: abs(int(icon.get('sizes', '0x0').split('x')[0]) - prefered_size) for icon in icons}
        if valid_icons:
            best_icon = min(valid_icons, key=valid_icons.get)
            return best_icon
        response = requests.get(urllib.parse.urljoin(icon_url, '/favicon.ico'), timeout=5)
        if response.ok:
            return urllib.parse.urljoin(icon_url, '/favicon.ico')
        return None
    except Exception as e:
        print(f"Error finding icon: {e}")
        return None

def download_icon(icon_url, filename, ext=None):
    """
    Download the icon from the given URL.
    :param icon_url: The URL of the icon.
    :param filename: The filename to save the icon as.
    """
    try:
        response = requests.get(icon_url, timeout=5)
        if response.status_code == 200:
            if ext is None:
                if icon_url.endswith('.ico'):
                    ext = '.ico'
                else:
                    ext = mimetypes.guess_extension(response.headers['Content-Type'], strict=False)
            with open(f"{filename}{ext}", 'wb') as f:
                f.write(response.content)
                
            print(f"Icon downloaded and saved as: {filename}{ext}")
    except Exception as e:
        print(f"Error downloading icon: {e}")

with open('src/links.json', 'r') as f:
    links = json.load(f)

os.makedirs('public/favicons', exist_ok=True)

for link in links['data']:
    if link.get('type') != 'link':
        continue
    icon_url = link.get('url')
    if icon_url:
        icon = find_icon(icon_url)
        print(f"Found icon: {icon}")
        if icon:
            icon = urllib.parse.urljoin(icon_url, icon)
            icon_name = os.path.basename(icon)
            filename = os.path.join('favicons', f"{secrets.token_hex(8)}")
            download_icon(icon,  os.path.join('public',filename))
            links['data'][links['data'].index(link)]['icon'] = '/'+filename
            print(f"Downloaded icon: {filename}")
        else:
            print(f"No icon found for {link['name']}")

with open('src/links.json', 'w') as f:
    json.dump(links, f, indent=4)
    print("Updated links.json with icon paths.")