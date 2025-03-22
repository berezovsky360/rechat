const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Додайте на початку файлу
const PORT = process.env.PORT || 5000;
const RAILWAY_STATIC_URL = process.env.RAILWAY_STATIC_URL || '';

// Завантаження змінних середовища
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Базові маршрути API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API працює' });
});

// Маршрути для роботи з n8n
app.get('/api/n8n/templates', async (req, res) => {
  try {
    // Тут буде логіка отримання шаблонів з n8n
    // Поки що повертаємо тестові дані
    const mockTemplates = Array.from({ length: 71 }, (_, i) => ({
      id: `template-${i + 1}`,
      name: `Шаблон робочого процесу ${i + 1}`,
      description: `Опис шаблону робочого процесу ${i + 1}. Цей шаблон демонструє можливості n8n для автоматизації задач.`,
      category: ['ai', 'secops', 'sales', 'itops', 'marketing'][Math.floor(Math.random() * 5)],
      nodes: Math.floor(Math.random() * 10) + 2,
      author: 'n8n Team',
      createdAt: new Date().toISOString()
    }));
    
    res.status(200).json({ success: true, data: mockTemplates });
  } catch (error) {
    console.error('Помилка при отриманні шаблонів n8n:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера при отриманні шаблонів' });
  }
});

app.post('/api/n8n/workflow', async (req, res) => {
  try {
    const { workflowData } = req.body;
    
    if (!workflowData) {
      return res.status(400).json({ success: false, message: 'Відсутні дані робочого процесу' });
    }
    
    // Тут буде логіка створення робочого процесу в n8n
    // Поки що імітуємо успішне створення
    
    res.status(201).json({ 
      success: true, 
      message: 'Робочий процес успішно створено', 
      workflowId: `wf-${Date.now()}` 
    });
  } catch (error) {
    console.error('Помилка при створенні робочого процесу n8n:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера при створенні робочого процесу' });
  }
});

// Маршрути для роботи з OpenRouter
app.get('/api/openrouter/models', async (req, res) => {
  try {
    // Тут буде логіка отримання доступних моделей з OpenRouter
    // Поки що повертаємо тестові дані
    const mockModels = [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', price: 'дешева', type: 'мовна', country: '🇺🇸', company: 'OpenAI' },
      { id: 'gpt-4', name: 'GPT-4', price: 'дорога', type: 'думаюча', country: '🇺🇸', company: 'OpenAI' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', price: 'дорога', type: 'думаюча', country: '🇺🇸', company: 'Anthropic' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', price: 'доступна', type: 'думаюча', country: '🇺🇸', company: 'Anthropic' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', price: 'дешева', type: 'мовна', country: '🇺🇸', company: 'Anthropic' },
      { id: 'llama-3-70b', name: 'Llama 3 70B', price: 'доступна', type: 'думаюча', country: '🇺🇸', company: 'Meta' },
      { id: 'gemini-pro', name: 'Gemini Pro', price: 'дешева', type: 'мовна', country: '🇺🇸', company: 'Google' },
      { id: 'gemini-ultra', name: 'Gemini Ultra', price: 'дорога', type: 'думаюча', country: '🇺🇸', company: 'Google' },
      { id: 'mistral-large', name: 'Mistral Large', price: 'доступна', type: 'думаюча', country: '🇫🇷', company: 'Mistral AI' },
      { id: 'mistral-small', name: 'Mistral Small', price: 'дешева', type: 'мовна', country: '🇫🇷', company: 'Mistral AI' },
      { id: 'yi-large', name: 'Yi Large', price: 'доступна', type: 'думаюча', country: '🇨🇳', company: '01.AI' },
      { id: 'qwen-72b', name: 'Qwen 72B', price: 'доступна', type: 'думаюча', country: '🇨🇳', company: 'Alibaba' },
    ];
    
    res.status(200).json({ success: true, data: mockModels });
  } catch (error) {
    console.error('Помилка при отриманні моделей OpenRouter:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера при отриманні моделей' });
  }
});

app.post('/api/chat/completion', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Відсутній текст запиту' });
    }
    
    // Тут буде логіка запиту до OpenRouter API
    // Поки що імітуємо відповідь
    
    // Приклад відповіді з JSON кодом
    const mockResponse = {
      id: `chat-${Date.now()}`,
      text: 'Я створив робочий процес для вашого запиту. Ось результат:',
      steps: [
        'Створюю ноду для HTTP Request',
        'Налаштовую параметри запиту',
        'Додаю ноду для обробки відповіді',
        'З\'єдную ноди між собою'
      ],
      json: {
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
            "position": [
              250,
              300
            ]
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
            "position": [
              450,
              300
            ]
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
          }
        }
      }
    };
    
    // Імітуємо затримку відповіді
    setTimeout(() => {
      res.status(200).json({ success: true, data: mockResponse });
    }, 1000);
  } catch (error) {
    console.error('Помилка при запиті до чату:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера при запиті до чату' });
  }
});

// Маршрути для роботи з історією та логами
app.get('/api/history', (req, res) => {
  try {
    // Тут буде логіка отримання історії запитів
    // Поки що повертаємо тестові дані
    const mockHistory = Array.from({ length: 20 }, (_, i) => ({
      id: `request-${i + 1}`,
      prompt: `Запит ${i + 1}: Створити робочий процес для ${['інтеграції з Google Drive', 'відправки повідомлень в Telegram', 'обробки даних з API', 'автоматизації маркетингу', 'моніторингу системи'][i % 5]}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      status: ['успішно', 'успішно', 'успішно', 'помилка', 'в обробці'][i % 5],
      nodes: Math.floor(Math.random() * 10) + 1,
      model: ['gpt-4', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro', 'mistral-large'][i % 5]
    }));
    
    res.status(200).json({ success: true, data: mockHistory });
  } catch (error) {
    console.error('Помилка при отриманні історії:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера при отриманні історії' });
  }
});

app.get('/api/logs', (req, res) => {
  try {
    // Тут буде логіка отримання логів
    // Поки що повертаємо тестові дані
    const mockLogs = {
      appLogs: Array.from({ length: 15 }, (_, i) => ({
        id: `log-${i + 1}`,
        timestamp: new Date(Date.now() - i * 600000).toISOString(),
        level: ['info', 'warning', 'error', 'debug'][i % 4],
        message: `Лог повідомлення ${i + 1}: ${['Запит до API', 'Обробка даних', 'Генерація JSON', 'Помилка з\'єднання', 'Успішне виконання'][i % 5]}`,
        source: ['frontend', 'backend', 'api', 'system'][i % 4]
      })),
      apiLogs: Array.from({ length: 10 }, (_, i) => ({
        id: `api-log-${i + 1}`,
        timestamp: new Date(Date.now() - i * 900000).toISOString(),
        endpoint: ['/api/n8n/workflows', '/api/openrouter/models', '/api/chat/completion', '/api/templates'][i % 4],
        method: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
        status: [200, 201, 400, 404, 500][i % 5],
        duration: Math.floor(Math.random() * 1000) + 50,
        requestSize: Math.floor(Math.random() * 10000) + 100,
        responseSize: Math.floor(Math.random() * 20000) + 200
      }))
    };
    
    res.status(200).json({ success: true, data: mockLogs });
  } catch (error) {
    console.error('Помилка при отриманні логів:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера при отриманні логів' });
  }
});

// Обслуговування статичних файлів фронтенду
// Цей код повинен бути після всіх API маршрутів але перед запуском сервера
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Перенаправлення всіх запитів на index.html якщо вони не співпадають з API маршрутами
app.get('*', (req, res) => {
  // Пропускаємо API запити
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API маршрут не знайдено' });
  }
  // Для всіх інших запитів повертаємо index.html
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

module.exports = app;
