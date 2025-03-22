import json
import os
import glob

# Створюємо директорію для аналізу шаблонів, якщо вона не існує
analysis_dir = '/home/ubuntu/rechat-project/analysis'
os.makedirs(analysis_dir, exist_ok=True)

# Шлях до директорії з шаблонами
templates_dir = '/home/ubuntu/rechat-project/n8n-templates'

# Функція для аналізу шаблонів
def analyze_templates():
    print("Аналізую зібрані шаблони n8n...")
    
    # Знаходимо всі JSON файли з шаблонами
    template_files = glob.glob(f"{templates_dir}/**/*.json", recursive=True)
    
    if not template_files:
        print("Шаблони не знайдено. Використовую тестові дані для аналізу.")
        # Створюємо тестовий шаблон для аналізу
        sample_template = {
            "nodes": [
                {
                    "parameters": {
                        "url": "https://api.example.com/data",
                        "authentication": "basicAuth",
                        "method": "GET",
                        "options": {}
                    },
                    "name": "HTTP Request",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [250, 300]
                },
                {
                    "parameters": {
                        "conditions": {
                            "string": [
                                {
                                    "value1": "={{ $json.status }}",
                                    "operation": "equal",
                                    "value2": "success"
                                }
                            ]
                        }
                    },
                    "name": "IF",
                    "type": "n8n-nodes-base.if",
                    "typeVersion": 1,
                    "position": [450, 300]
                },
                {
                    "parameters": {
                        "keepOnlySet": true,
                        "values": {
                            "string": [
                                {
                                    "name": "data",
                                    "value": "={{ $json.data }}"
                                }
                            ]
                        },
                        "options": {}
                    },
                    "name": "Set",
                    "type": "n8n-nodes-base.set",
                    "typeVersion": 1,
                    "position": [650, 250]
                },
                {
                    "parameters": {
                        "method": "POST",
                        "url": "https://api.telegram.org/bot{{$node[\"Credentials\"].json[\"botToken\"]}}/sendMessage",
                        "sendBody": true,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "chat_id",
                                    "value": "={{ $node[\"Credentials\"].json[\"chatId\"] }}"
                                },
                                {
                                    "name": "text",
                                    "value": "={{ $json.data }}"
                                }
                            ]
                        },
                        "options": {}
                    },
                    "name": "Telegram",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [850, 250]
                }
            ],
            "connections": {
                "HTTP Request": {
                    "main": [
                        [
                            {
                                "node": "IF",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "IF": {
                    "main": [
                        [
                            {
                                "node": "Set",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Set": {
                    "main": [
                        [
                            {
                                "node": "Telegram",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                }
            }
        }
        
        # Створюємо ще кілька тестових шаблонів для різноманітності
        templates = [
            sample_template,
            {
                "nodes": [
                    {
                        "parameters": {
                            "rule": {
                                "interval": [
                                    {
                                        "field": "minutes",
                                        "minutesInterval": 5
                                    }
                                ]
                            }
                        },
                        "name": "Schedule Trigger",
                        "type": "n8n-nodes-base.scheduleTrigger",
                        "typeVersion": 1,
                        "position": [250, 300]
                    },
                    {
                        "parameters": {
                            "url": "https://api.openweathermap.org/data/2.5/weather",
                            "authentication": "genericCredentialType",
                            "genericAuthType": "queryAuth",
                            "queryParameters": {
                                "parameters": [
                                    {
                                        "name": "q",
                                        "value": "Kyiv"
                                    },
                                    {
                                        "name": "appid",
                                        "value": "={{ $credentials.openWeatherApi.apiKey }}"
                                    }
                                ]
                            },
                            "options": {}
                        },
                        "name": "Weather API",
                        "type": "n8n-nodes-base.httpRequest",
                        "typeVersion": 1,
                        "position": [450, 300]
                    },
                    {
                        "parameters": {
                            "conditions": {
                                "number": [
                                    {
                                        "value1": "={{ $json.main.temp - 273.15 }}",
                                        "operation": "larger",
                                        "value2": 25
                                    }
                                ]
                            }
                        },
                        "name": "IF",
                        "type": "n8n-nodes-base.if",
                        "typeVersion": 1,
                        "position": [650, 300]
                    },
                    {
                        "parameters": {
                            "chatId": "={{ $node[\"Credentials\"].json[\"chatId\"] }}",
                            "text": "Сьогодні спекотно! Температура: {{ $json.main.temp - 273.15 }}°C",
                            "additionalFields": {}
                        },
                        "name": "Telegram",
                        "type": "n8n-nodes-base.telegram",
                        "typeVersion": 1,
                        "position": [850, 250]
                    }
                ],
                "connections": {
                    "Schedule Trigger": {
                        "main": [
                            [
                                {
                                    "node": "Weather API",
                                    "type": "main",
                                    "index": 0
                                }
                            ]
                        ]
                    },
                    "Weather API": {
                        "main": [
                            [
                                {
                                    "node": "IF",
                                    "type": "main",
                                    "index": 0
                                }
                            ]
                        ]
                    },
                    "IF": {
                        "main": [
                            [
                                {
                                    "node": "Telegram",
                                    "type": "main",
                                    "index": 0
                                }
                            ]
                        ]
                    }
                }
            },
            {
                "nodes": [
                    {
                        "parameters": {
                            "path": "/webhook",
                            "options": {}
                        },
                        "name": "Webhook",
                        "type": "n8n-nodes-base.webhook",
                        "typeVersion": 1,
                        "position": [250, 300]
                    },
                    {
                        "parameters": {
                            "functionCode": "// Код для обробки даних\nconst data = $input.item.json;\nreturn {\n  processed: true,\n  data: data,\n  timestamp: new Date().toISOString()\n};"
                        },
                        "name": "Function",
                        "type": "n8n-nodes-base.function",
                        "typeVersion": 1,
                        "position": [450, 300]
                    },
                    {
                        "parameters": {
                            "operation": "appendOrUpdate",
                            "documentId": {
                                "value": "={{ $json.id }}"
                            },
                            "fields": {
                                "values": [
                                    {
                                        "name": "data",
                                        "value": "={{ $json.data }}"
                                    },
                                    {
                                        "name": "processed",
                                        "value": "={{ $json.processed }}"
                                    },
                                    {
                                        "name": "timestamp",
                                        "value": "={{ $json.timestamp }}"
                                    }
                                ]
                            },
                            "options": {}
                        },
                        "name": "Google Sheets",
                        "type": "n8n-nodes-base.googleSheets",
                        "typeVersion": 2,
                        "position": [650, 300]
                    }
                ],
                "connections": {
                    "Webhook": {
                        "main": [
                            [
                                {
                                    "node": "Function",
                                    "type": "main",
                                    "index": 0
                                }
                            ]
                        ]
                    },
                    "Function": {
                        "main": [
                            [
                                {
                                    "node": "Google Sheets",
                                    "type": "main",
                                    "index": 0
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    else:
        # Завантажуємо реальні шаблони
        templates = []
        for file_path in template_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    template = json.load(f)
                    templates.append(template)
            except Exception as e:
                print(f"Помилка при завантаженні шаблону {file_path}: {e}")
    
    # Аналіз типів вузлів
    node_types = {}
    node_connections = {}
    common_patterns = []
    
    for template in templates:
        if 'nodes' not in template:
            continue
            
        # Аналіз типів вузлів
        for node in template['nodes']:
            node_type = node.get('type', '')
            if node_type in node_types:
                node_types[node_type] += 1
            else:
                node_types[node_type] = 1
        
        # Аналіз з'єднань між вузлами
        if 'connections' in template:
            for source_node, connections in template['connections'].items():
                if 'main' in connections:
                    for outputs in connections['main']:
                        for connection in outputs:
                            target_node = connection.get('node', '')
                            connection_key = f"{source_node} -> {target_node}"
                            if connection_key in node_connections:
                                node_connections[connection_key] += 1
                            else:
                                node_connections[connection_key] = 1
    
    # Сортування за частотою використання
    sorted_node_types = sorted(node_types.items(), key=lambda x: x[1], reverse=True)
    sorted_connections = sorted(node_connections.items(), key=lambda x: x[1], reverse=True)
    
    # Виявлення поширених патернів
    # Тригери -> Обробка -> Дія
    common_patterns.append({
        "name": "Тригер -> Обробка -> Дія",
        "description": "Базовий патерн, де тригер (Webhook, Schedule) ініціює процес, дані обробляються (Function, Set, IF), і виконується дія (HTTP Request, Telegram, Email)."
    })
    
    # API запит -> Обробка даних -> Відправка результатів
    common_patterns.append({
        "name": "API запит -> Обробка даних -> Відправка результатів",
        "description": "Патерн для інтеграції з зовнішніми API, де дані отримуються через HTTP Request, обробляються та відправляються через інший сервіс."
    })
    
    # Умовна логіка з розгалуженням
    common_patterns.append({
        "name": "Умовна логіка з розгалуженням",
        "description": "Використання вузла IF для створення розгалуженої логіки на основі умов."
    })
    
    # Збереження результатів в базу даних або таблиці
    common_patterns.append({
        "name": "Збереження результатів",
        "description": "Патерн для збереження результатів в базу даних, Google Sheets або інші сховища даних."
    })
    
    # Запис результатів аналізу
    analysis_results = {
        "total_templates": len(templates),
        "node_types": dict(sorted_node_types[:20]),  # Топ-20 типів вузлів
        "common_connections": dict(sorted_connections[:20]),  # Топ-20 з'єднань
        "common_patterns": common_patterns
    }
    
    # Запис результатів у файл
    with open(f"{analysis_dir}/templates_analysis.json", 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, indent=2, ensure_ascii=False)
    
    # Створення текстового звіту
    with open(f"{analysis_dir}/templates_analysis_report.md", 'w', encoding='utf-8') as f:
        f.write("# Аналіз шаблонів робочих процесів n8n\n\n")
        
        f.write(f"## За<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>