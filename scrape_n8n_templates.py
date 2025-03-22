import requests
import json
import os
import time
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

# Базові налаштування
BASE_URL = "https://n8n.io/workflows/"
API_URL = "https://api.n8n.io/api/templates/search"
TEMPLATES_DIR = "/home/ubuntu/rechat-project/n8n-templates"
CATEGORIES_DIR = os.path.join(TEMPLATES_DIR, "categories")
TEMPLATES_JSON = os.path.join(TEMPLATES_DIR, "all_templates.json")
TEMPLATES_METADATA = os.path.join(TEMPLATES_DIR, "templates_metadata.json")

# Створення директорій, якщо вони не існують
os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(CATEGORIES_DIR, exist_ok=True)

# Категорії шаблонів, які ми бачили на сайті
CATEGORIES = [
    "ai", "secops", "sales", "itops", "marketing", 
    "engineering", "devops", "building-blocks", "design", 
    "finance", "hr", "other", "product", "support"
]

# Функція для отримання шаблонів через API
def fetch_templates(category=None, page=1, limit=100):
    params = {
        "limit": limit,
        "page": page
    }
    
    if category:
        params["categories"] = category
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(API_URL, params=params, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Помилка при отриманні шаблонів: {e}")
        return {"data": {"items": []}}

# Функція для отримання деталей шаблону
def fetch_template_details(template_id):
    url = f"https://api.n8n.io/api/templates/{template_id}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Помилка при отриманні деталей шаблону {template_id}: {e}")
        return None

# Функція для збереження шаблону
def save_template(template_data, category=None):
    template_id = template_data.get("id")
    if not template_id:
        return False
    
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
    
    return True

# Функція для збору всіх шаблонів
def collect_all_templates():
    all_templates = []
    templates_metadata = {}
    
    # Спочатку збираємо шаблони по категоріях
    for category in CATEGORIES:
        print(f"Збираємо шаблони для категорії: {category}")
        category_templates = []
        page = 1
        
        while True:
            result = fetch_templates(category=category, page=page)
            items = result.get("data", {}).get("items", [])
            
            if not items:
                break
                
            for item in items:
                template_id = item.get("id")
                if template_id:
                    category_templates.append(template_id)
                    
                    # Зберігаємо метадані шаблону
                    templates_metadata[template_id] = {
                        "id": template_id,
                        "name": item.get("name", ""),
                        "description": item.get("description", ""),
                        "category": category,
                        "totalViews": item.get("totalViews", 0),
                        "createdAt": item.get("createdAt", "")
                    }
                    
                    # Отримуємо повні деталі шаблону
                    template_details = fetch_template_details(template_id)
                    if template_details:
                        save_template(template_details, category)
                        all_templates.append(template_id)
                    
                    # Невелика затримка, щоб не перевантажувати сервер
                    time.sleep(0.5)
            
            page += 1
            # Невелика затримка між сторінками
            time.sleep(1)
        
        print(f"Зібрано {len(category_templates)} шаблонів для категорії {category}")
    
    # Тепер збираємо всі шаблони, які могли бути пропущені
    print("Збираємо всі шаблони...")
    page = 1
    
    while True:
        result = fetch_templates(page=page, limit=100)
        items = result.get("data", {}).get("items", [])
        
        if not items:
            break
            
        for item in items:
            template_id = item.get("id")
            if template_id and template_id not in all_templates:
                # Зберігаємо метадані шаблону
                templates_metadata[template_id] = {
                    "id": template_id,
                    "name": item.get("name", ""),
                    "description": item.get("description", ""),
                    "category": "uncategorized",
                    "totalViews": item.get("totalViews", 0),
                    "createdAt": item.get("createdAt", "")
                }
                
                # Отримуємо повні деталі шаблону
                template_details = fetch_template_details(template_id)
                if template_details:
                    save_template(template_details)
                    all_templates.append(template_id)
                
                # Невелика затримка, щоб не перевантажувати сервер
                time.sleep(0.5)
        
        page += 1
        # Невелика затримка між сторінками
        time.sleep(1)
    
    # Зберігаємо список всіх шаблонів
    with open(TEMPLATES_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_templates, f, ensure_ascii=False, indent=2)
    
    # Зберігаємо метадані всіх шаблонів
    with open(TEMPLATES_METADATA, 'w', encoding='utf-8') as f:
        json.dump(templates_metadata, f, ensure_ascii=False, indent=2)
    
    print(f"Всього зібрано {len(all_templates)} шаблонів")
    return all_templates

if __name__ == "__main__":
    print("Починаємо збір шаблонів n8n...")
    collect_all_templates()
    print("Збір шаблонів завершено!")
