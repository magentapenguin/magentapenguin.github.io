import requests, bs4, json, os, secrets, mimetypes

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
        for icon in icons:
            sizes = icon.get('sizes')
            if sizes and int(sizes.split('x')[0]) >= prefered_size:
                return icon.get('href')
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
                ext = mimetypes.guess_extension(response.headers['Content-Type'])
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
            icon_name = os.path.basename(icon)
            filename = os.path.join('public/favicons', f"{icon_name}")
            download_icon(icon, filename)
            link['icon'] = filename
            print(f"Downloaded icon: {filename}")
        else:
            print(f"No icon found for {link['name']}")
    