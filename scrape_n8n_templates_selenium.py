import os
import json
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Базові налаштування
BASE_URL = "https://n8n.io/workflows/"
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

def setup_driver():
    """Налаштування драйвера Selenium"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def get_template_cards(driver, category=None, max_pages=20):
    """Отримання карток шаблонів з сайту"""
    url = BASE_URL
    if category:
        url = f"{BASE_URL}?categories={category}"
    
    driver.get(url)
    time.sleep(3)  # Даємо час для завантаження сторінки
    
    template_cards = []
    current_page = 1
    
    while current_page <= max_pages:
        try:
            # Чекаємо, поки завантажаться картки шаблонів
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".workflow-card, .card, .template-card"))
            )
            
            # Отримуємо всі картки шаблонів на поточній сторінці
            cards = driver.find_elements(By.CSS_SELECTOR, ".workflow-card, .card, .template-card")
            
            if not cards:
                print(f"Не знайдено карток шаблонів на сторінці {current_page}")
                break
                
            print(f"Знайдено {len(cards)} карток на сторінці {current_page}")
            
            for card in cards:
                try:
                    # Отримуємо посилання на шаблон
                    link_element = card.find_element(By.CSS_SELECTOR, "a")
                    link = link_element.get_attribute("href")
                    
                    # Отримуємо ID шаблону з посилання
                    template_id = link.split("/")[-1]
                    
                    # Отримуємо назву шаблону
                    name = ""
                    try:
                        name_element = card.find_element(By.CSS_SELECTOR, ".workflow-card-title, .card-title, .template-title, h3, h4")
                        name = name_element.text
                    except NoSuchElementException:
                        pass
                    
                    # Отримуємо опис шаблону (якщо є)
                    description = ""
                    try:
                        desc_element = card.find_element(By.CSS_SELECTOR, ".workflow-card-description, .card-description, .template-description, p")
                        description = desc_element.text
                    except NoSuchElementException:
                        pass
                    
                    template_cards.append({
                        "id": template_id,
                        "name": name,
                        "description": description,
                        "url": link,
                        "category": category if category else "uncategorized"
                    })
                except Exception as e:
                    print(f"Помилка при обробці картки: {e}")
            
            # Перевіряємо, чи є кнопка "Наступна сторінка"
            try:
                next_button = driver.find_element(By.CSS_SELECTOR, "button.pagination-next, .next-page, [aria-label='Next page']")
                if "disabled" in next_button.get_attribute("class") or not next_button.is_enabled():
                    print("Кнопка 'Наступна сторінка' неактивна")
                    break
                next_button.click()
                print(f"Перехід на сторінку {current_page + 1}")
                time.sleep(2)  # Даємо час для завантаження наступної сторінки
                current_page += 1
            except NoSuchElementException:
                print("Кнопка 'Наступна сторінка' не знайдена")
                break
        except TimeoutException:
            print(f"Час очікування вичерпано при завантаженні сторінки {current_page}")
            break
        except Exception as e:
            print(f"Помилка при обробці сторінки {current_page}: {e}")
            break
    
    return template_cards

def get_template_details(driver, template_url):
    """Отримання деталей шаблону"""
    try:
        driver.get(template_url)
        time.sleep(3)  # Даємо час для завантаження сторінки
        
        # Отримуємо HTML сторінки для аналізу
        page_source = driver.page_source
        
        # ID шаблону
        template_id = template_url.split("/")[-1]
        
        # Базова структура даних шаблону
        template_data = {
            "id": template_id,
            "url": template_url,
            "name": "",
            "description": "",
            "author": "",
            "html_source": page_source  # Зберігаємо HTML для подальшого аналізу
        }
        
        # Спроба отримати назву шаблону
        try:
            title_elements = driver.find_elements(By.CSS_SELECTOR, "h1, .template-title, .workflow-title")
            if title_elements:
                template_data["name"] = title_elements[0].text
        except Exception:
            pass
        
        # Спроба отримати опис шаблону
        try:
            desc_elements = driver.find_elements(By.CSS_SELECTOR, ".template-description, .workflow-description, p")
            if desc_elements:
                template_data["description"] = desc_elements[0].text
        except Exception:
            pass
        
        # Спроба отримати автора шаблону
        try:
            author_elements = driver.find_elements(By.CSS_SELECTOR, ".template-author, .workflow-author, .author")
            if author_elements:
                template_data["author"] = author_elements[0].text
        except Exception:
            pass
        
        # Спроба знайти JSON код шаблону
        try:
            # Шукаємо елементи, які можуть містити JSON
            code_elements = driver.find_elements(By.CSS_SELECTOR, "pre, code, .json-code, .workflow-json")
            
            for element in code_elements:
                try:
                    code_text = element.text
                    if code_text and ('"nodes":' in code_text or '"workflow":' in code_text):
                        try:
                            # Спроба парсити як JSON
                            json_data = json.loads(code_text)
                            template_data["workflow"] = json_data
                            break
                        except json.JSONDecodeError:
                            # Якщо не вдалося парсити, зберігаємо як текст
                            template_data["workflow_raw"] = code_text
                except Exception:
                    continue
        except Exception:
            pass
        
        # Спроба знайти зображення шаблону
        try:
            img_elements = driver.find_elements(By.CSS_SELECTOR, "img.template-image, img.workflow-image, .template-preview img")
            if img_elements:
                template_data["image_url"] = img_elements[0].get_attribute("src")
        except Exception:
            pass
        
        return template_data
    except Exception as e:
        print(f"Помилка при отриманні деталей шаблону {template_url}: {e}")
        return None

def download_template_image(url, template_id):
    """Завантаження зображення шаблону"""
    if not url:
        return None
    
    try:
        response = requests.get(url, stream=True)
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

def collect_all_templates():
    """Збір всіх шаблонів"""
    driver = setup_driver()
    all_templates = []
    templates_metadata = {}
    
    try:
        # Спочатку збираємо шаблони по категоріях
        for category in CATEGORIES:
            print(f"Збираємо шаблони для категорії: {category}")
            
            # Отримуємо картки шаблонів для категорії
            template_cards = get_template_cards(driver, category)
            
            print(f"Знайдено {len(template_cards)} шаблонів для категорії {category}")
            
            # Обробляємо кожну картку
            for card in template_cards:
                template_id = card["id"]
                
                # Зберігаємо метадані шаблону
                templates_metadata[template_id] = {
                    "id": template_id,
                    "name": card["name"],
                    "description": card["description"],
                    "category": category,
                    "url": card["url"]
                }
                
                # Отримуємо деталі шаблону
                template_details = get_template_details(driver, card["url"])
                
                if template_details:
                    # Додаємо категорію до деталей
                    template_details["category"] = category
                    
                    # Зберігаємо шаблон
                    save_template(template_details, category)
                    all_templates.append(template_id)
                
                # Невелика затримка, щоб не перевантажувати сервер
                time.sleep(1)
        
        # Тепер збираємо всі шаблони, які могли бути пропущені
        print("Збираємо всі шаблони...")
        
        # Отримуємо картки всіх шаблонів
        all_template_cards = get_template_cards(driver)
        
        print(f"Знайдено {len(all_template_cards)} шаблонів загалом")
        
        # Обробляємо кожну картку
        for card in all_template_cards:
            template_id = card["id"]
            
            # Пропускаємо шаблони, які вже були оброблені
            if template_id in all_templates:
                continue
            
            # Зберігаємо метадані шаблону
            templates_metadata[template_id] = {
                "id": template_id,
                "name": card["name"],
                "description": card["description"],
                "category": "uncategorized",
                "url": card["url"]
            }
            
            # Отримуємо деталі шаблону
            template_details = get_template_details(driver, card["url"])
            
            if template_details:
                # Зберігаємо шаблон
                save_template(template_details)
                all_templates.append(template_id)
            
            # Невелика затримка, щоб не перевантажувати сервер
            time.sleep(1)
    finally:
        # Закриваємо драйвер
        driver.quit()
    
    # Зберігаємо список всіх шаблонів
    with open(TEMPLATES_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_templates, f, ensure_ascii=False, indent=2)
    
    # Зберігаємо метадані всіх шаблонів
    with open(TEMPLATES_METADATA, 'w', encoding='utf-8') as f:
        json.dump(templates_metadata, f, ensure_ascii=False, indent=2)
    
    print(f"Всього зібрано {len(all_templates)} шаблонів")
    return all_templates

if __name__ == "__main__":
    print("Починаємо збір шаблонів n8n за допомогою Selenium...")
    collect_all_templates()
    print("Збір шаблонів завершено!")
