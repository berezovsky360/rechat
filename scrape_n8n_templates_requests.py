import os
import json
import time
import requests
from bs4 import BeautifulSoup
import re

# Базові налаштування
BASE_URL = "https://n8n.io/workflows/"
API_URL = "https://n8n.io/api/workflows"
TEMPLATES_DIR = "/home/ubuntu/rechat-project/n8n-templates"
CATEGORIES_DIR = os.path.join(TEMPLATES_DIR, "categories")
TEMPLATES_JSON = os.path.join(TEMPLATES_DIR, "all_templates.json")
TEMPLATES_METADATA = os.path.join(TEMPLATES_DIR, "templates_metadata.json")

# Створення директорій, якщо вони не існують
os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(CATEGORIES_DIR, exist_ok=True)

# Категорії шаблонів
CATEGORIES = [
    "ai", "secops", "sales", "itops", "marketing", 
    "engineering", "devops", "building-blocks", "design", 
    "finance", "hr", "other", "product", "support"
]

def get_templates_from_page(url):
    """Отримання шаблонів з однієї сторінки"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Шукаємо всі картки шаблонів
        template_cards = []
        
        # Спроба знайти картки за різними селекторами
        cards = soup.select('.workflow-card, .card, .template-card, [class*="workflow"], [class*="template"]')
        
        if not cards:
            # Якщо не знайдено за селекторами, шукаємо всі div з посиланнями
            cards = soup.select('div > a')
        
        for card in cards:
            try:
                # Отримуємо посилання на шаблон
                link = None
                if card.name == 'a':
                    link = card.get('href')
                else:
                    link_element = card.select_one('a')
                    if link_element:
                        link = link_element.get('href')
                
                if not link or '/workflows/' not in link:
                    continue
                
                # Отримуємо ID шаблону з посилання
                template_id = link.split('/')[-1]
                
                # Отримуємо назву шаблону
                name = ""
                name_element = card.select_one('h3, h4, [class*="title"]')
                if name_element:
                    name = name_element.text.strip()
                
                # Отримуємо опис шаблону
                description = ""
                desc_element = card.select_one('p, [class*="description"]')
                if desc_element:
                    description = desc_element.text.strip()
                
                template_cards.append({
                    "id": template_id,
                    "name": name,
                    "description": description,
                    "url": link if link.startswith('http') else f"https://n8n.io{link}"
                })
            except Exception as e:
                print(f"Помилка при обробці картки: {e}")
        
        # Шукаємо посилання на наступну сторінку
        next_page_url = None
        next_button = soup.select_one('[class*="next"], [aria-label*="Next"]')
        if next_button and next_button.name == 'a':
            next_page_url = next_button.get('href')
            if next_page_url and not next_page_url.startswith('http'):
                next_page_url = f"https://n8n.io{next_page_url}"
        
        return template_cards, next_page_url
    except Exception as e:
        print(f"Помилка при отриманні шаблонів з {url}: {e}")
        return [], None

def get_template_details(url):
    """Отримання деталей шаблону"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # ID шаблону
        template_id = url.split('/')[-1]
        
        # Базова структура даних шаблону
        template_data = {
            "id": template_id,
            "url": url,
            "name": "",
            "description": "",
            "author": "",
            "html_source": response.text  # Зберігаємо HTML для подальшого аналізу
        }
        
        # Спроба отримати назву шаблону
        title_element = soup.select_one('h1, [class*="title"]')
        if title_element:
            template_data["name"] = title_element.text.strip()
        
        # Спроба отримати опис шаблону
        desc_element = soup.select_one('[class*="description"], p')
        if desc_element:
            template_data["description"] = desc_element.text.strip()
        
        # Спроба отримати автора шаблону
        author_element = soup.select_one('[class*="author"]')
        if author_element:
            template_data["author"] = author_element.text.strip()
        
        # Спроба знайти JSON код шаблону
        code_elements = soup.select('pre, code, [class*="json"], [class*="code"]')
        
        for element in code_elements:
            code_text = element.text.strip()
            if code_text and ('"nodes":' in code_text or '"workflow":' in code_text):
                try:
                    # Спроба парсити як JSON
                    json_data = json.loads(code_text)
                    template_data["workflow"] = json_data
                    break
                except json.JSONDecodeError:
                    # Якщо не вдалося парсити, зберігаємо як текст
                    template_data["workflow_raw"] = code_text
        
        # Спроба знайти зображення шаблону
        img_element = soup.select_one('img[class*="template"], img[class*="workflow"], [class*="preview"] img')
        if img_element:
            template_data["image_url"] = img_element.get('src')
            if template_data["image_url"] and not template_data["image_url"].startswith('http'):
                template_data["image_url"] = f"https://n8n.io{template_data['image_url']}"
        
        # Спроба знайти JSON в скриптах
        script_elements = soup.select('script')
        for script in script_elements:
            script_text = script.string
            if script_text:
                # Шукаємо JSON об'єкти, які можуть містити дані шаблону
                json_matches = re.findall(r'({[\s\S]*?"nodes"[\s\S]*?})', script_text)
                for json_match in json_matches:
                    try:
                        json_data = json.loads(json_match)
                        if "nodes" in json_data:
                            template_data["workflow"] = json_data
                            break
                    except json.JSONDecodeError:
                        continue
        
        return template_data
    except Exception as e:
        print(f"Помилка при отриманні деталей шаблону {url}: {e}")
        return None

def download_template_image(url, template_id):
    """Завантаження зображення шаблону"""
    if not url:
        return None
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        response = requests.get(url, headers=headers, stream=True)
        if response.status_code == 200:
            img_dir = os.path.join(TEMPLATES_DIR, "images")
            os.makedirs(img_dir, exist_ok=True)
            
            img_path = os.path.join(img_dir, f"{template_id}.png")
            with open(img_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return img_path
    except Exception as e:
        print(f"Помилка при завантаженні зображення {url}: {e}")
    
    return None

def save_template(template_data, category=None):
    """Збереження даних шаблону"""
    if not template_data or "id" not in template_data:
        return False
    
    template_id = template_data["id"]
    
    # Зберігаємо в загальній директорії
    template_file = os.path.join(TEMPLATES_DIR, f"{template_id}.json")
    with open(template_file, 'w', encoding='utf-8') as f:
        json.dump(template_data, f, ensure_ascii=False, indent=2)
    
    # Якщо вказана категорія, зберігаємо також в директорії категорії
    if category:
        category_dir = os.path.join(CATEGORIES_DIR, category)
        os.makedirs(category_dir, exist_ok=True)
        category_file = os.path.join(category_dir, f"{template_id}.json")
        with open(category_file, 'w', encoding='utf-8') as f:
            json.dump(template_data, f, ensure_ascii=False, indent=2)
    
    # Якщо є URL зображення, завантажуємо його
    if "image_url" in template_data:
        download_template_image(template_data["image_url"], template_id)
    
    return True

def collect_templates_by_category(category=None):
    """Збір шаблонів за категорією"""
    url = BASE_URL
    if category:
        url = f"{BASE_URL}?categories={category}"
    
    all_templates = []
    page_num = 1
    
    while url and page_num <= 20:  # Обмеження на 20 сторінок
        print(f"Обробка сторінки {page_num} для категорії {category if category else 'всі'}")
        
        templates, next_url = get_templates_from_page(url)
        
        print(f"Знайдено {len(templates)} шаблонів на сторінці {page_num}")
        
        for template in templates:
            template_id = template["id"]
            
            # Отримуємо деталі шаблону
            template_details = get_template_details(template["url"])
            
            if template_details:
                # Додаємо категорію до деталей
                if category:
                    template_details["category"] = category
                
                # Зберігаємо шаблон
                save_template(template_details, category)
                all_templates.append(template_id)
            
            # Невелика затримка, щоб не перевантажувати сервер
            time.sleep(1)
        
        if not next_url:
            break
        
        url = next_url
        page_num += 1
        
        # Невелика затримка між сторінками
        time.sleep(2)
    
    return all_templates

def collect_all_templates():
    """Збір всіх шаблонів"""
    all_templates = []
    templates_metadata = {}
    
    # Спочатку збираємо шаблони по категоріях
    for category in CATEGORIES:
        print(f"Збираємо шаблони для категорії: {category}")
        
        category_templates = collect_templates_by_category(category)
        
        print(f"Зібрано {len(category_templates)} шаблонів для категорії {category}")
        
        all_templates.extend(category_templates)
    
    # Тепер збираємо всі шаблони, які могли бути пропущені
    print("Збираємо всі шаблони...")
    
    uncategorized_templates = collect_templates_by_category()
    
    # Додаємо тільки нові шаблони
    for template_id in uncategorized_templates:
        if template_id not in all_templates:
            all_templates.append(template_id)
    
    # Створюємо метадані для всіх шаблонів
    for template_id in all_templates:
        template_file = os.path.join(TEMPLATES_DIR, f"{template_id}.json")
        
        if os.path.exists(template_file):
            try:
                with open(template_file, 'r', encoding='utf-8') as f:
                    template_data = json.load(f)
                
                templates_metadata[template_id] = {
                    "id": template_id,
                    "name": template_data.get("name", ""),
                    "description": template_data.get("description", ""),
                    "category": template_data.get("category", "uncategorized"),
                    "url": template_data.get("url", "")
                }
            except Exception as e:
                print(f"Помилка при створенні метаданих для шаблону {template_id}: {e}")
    
    # Зберігаємо список всіх шаблонів
    with open(TEMPLATES_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_templates, f, ensure_ascii=False, indent=2)
    
    # Зберігаємо метадані всіх шаблонів
    with open(TEMPLATES_METADATA, 'w', encoding='utf-8') as f:
        json.dump(templates_metadata, f, ensure_ascii=False, indent=2)
    
    print(f"Всього зібрано {len(all_templates)} шаблонів")
    return all_templates

def collect_sample_templates():
    """Збір зразків шаблонів для аналізу"""
    print("Збираємо зразки шаблонів для аналізу...")
    
    # Список URL шаблонів для збору
    sample_urls = [
        "https://n8n.io/workflows/1234",  # Замініть на реальні URL
        "https://n8n.io/workflows/5678",
        "https://n8n.io/workflows/9012"
    ]
    
    # Спробуємо знайти URL шаблонів на головній сторінці
    try:
        response = requests.get(BASE_URL, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Шукаємо всі посилання, які можуть вести на шаблони
        links = soup.select('a[href*="/workflows/"]')
        
        sample_urls = []
        for link in links[:10]:  # Беремо перші 10 посилань
            href = link.get('href')
            if href and '/workflows/' in href:
                full_url = href if href.startswith('http') else f"https://n8n.io{href}"
                sample_urls.append(full_url)
    except Exception as e:
        print(f"Помилка при пошуку зразків шаблонів: {e}")
    
    # Збираємо зразки шаблонів
    sample_templates = []
    
    for url in sample_urls:
        print(f"Обробка зразка шаблону: {url}")
        
        template_id = url.split('/')[-1]
        
        # Отримуємо деталі шаблону
        template_details = get_template_details(url)
        
        if template_details:
            # Зберігаємо шаблон
            save_template(template_details)
            sample_templates.append(template_id)
        
        # Невелика затримка, щоб не перевантажувати сервер
        time.sleep(1)
    
    # Зберігаємо список зразків шаблонів
    sample_json = os.path.join(TEMPLATES_DIR, "sample_templates.json")
    with open(sample_json, 'w', encoding='utf-8') as f:
        json.dump(sample_templates, f, ensure_ascii=False, indent=2)
    
    print(f"Зібрано {len(sample_templates)} зразків шаблонів")
    return sample_templates

if __name__ == "__main__":
    print("Починаємо збір шаблонів n8n за допомогою requests і BeautifulSoup...")
    
    # Спочатку збираємо зразки шаблонів для аналізу
    collect_sample_templates()
    
    # Потім збираємо всі шаблони
    collect_all_templates()
    
    print("Збір шаблонів завершено!")
