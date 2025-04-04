// Файл для роботи з n8n API

// Отримання даних з localStorage або .env
const getApiUrl = () => {
  return localStorage.getItem('n8n_api_url') || import.meta.env.VITE_N8N_API_URL || '';
};

const getApiKey = () => {
  return localStorage.getItem('n8n_api_key') || import.meta.env.VITE_N8N_API_KEY || '';
};

/**
 * Перевірка наявності конфігурації API
 * @returns {boolean} Чи налаштовано API
 */
export const isConfigured = () => {
  return !!getApiUrl() && !!getApiKey();
};

/**
 * Отримання списку workflows з n8n
 * @returns {Promise<Array>} Список робочих процесів
 */
export const fetchWorkflows = async () => {
  try {
    const apiUrl = getApiUrl();
    const apiKey = getApiKey();
    
    if (!apiUrl || !apiKey) {
      throw new Error('n8n API не налаштовано. Додайте URL та API ключ у налаштуваннях.');
    }

    const response = await fetch(`${apiUrl}/workflows`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': apiKey,
      }
    });

    if (!response.ok) {
      throw new Error(`Помилка отримання workflows: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Помилка n8n API:', error);
    throw error;
  }
};

/**
 * Створення нового workflow в n8n
 * @param {Object} workflow Об'єкт workflow
 * @returns {Promise<Object>} Створений workflow
 */
export const createWorkflow = async (workflow) => {
  try {
    const apiUrl = getApiUrl();
    const apiKey = getApiKey();
    
    if (!apiUrl || !apiKey) {
      throw new Error('n8n API не налаштовано. Додайте URL та API ключ у налаштуваннях.');
    }

    const response = await fetch(`${apiUrl}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': apiKey
      },
      body: JSON.stringify(workflow)
    });

    if (!response.ok) {
      throw new Error(`Помилка створення workflow: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Помилка n8n API:', error);
    throw error;
  }
};

/**
 * Виконання workflow за ID
 * @param {string} workflowId ID робочого процесу
 * @param {Object} data Дані для виконання
 * @returns {Promise<Object>} Результат виконання
 */
export const executeWorkflow = async (workflowId, data = {}) => {
  try {
    const apiUrl = getApiUrl();
    const apiKey = getApiKey();
    
    if (!apiUrl || !apiKey) {
      throw new Error('n8n API не налаштовано. Додайте URL та API ключ у налаштуваннях.');
    }

    if (!workflowId) {
      throw new Error('ID робочого процесу не вказано');
    }

    const response = await fetch(`${apiUrl}/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': apiKey
      },
      body: JSON.stringify({
        data
      })
    });

    if (!response.ok) {
      throw new Error(`Помилка виконання workflow: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Помилка n8n API:', error);
    throw error;
  }
};

/**
 * Перетворення JSON даних чату в формат Workflow для n8n
 * @param {Array} messages Повідомлення чату
 * @returns {Object} Об'єкт workflow
 */
export const convertChatToWorkflow = (messages) => {
  // Витягуємо останнє повідомлення від користувача
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')?.content || '';
  
  // Створюємо базову структуру workflow
  const workflow = {
    name: `Workflow від ${new Date().toLocaleString('uk-UA')}`,
    nodes: [
      {
        // Початковий вузол - тригер
        parameters: {
          rule: {
            interval: [
              {
                field: "seconds",
                minutesInterval: 1
              }
            ]
          }
        },
        name: "Schedule Trigger",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1,
        position: [250, 300]
      },
      {
        // Вузол обробки даних від чату
        parameters: {
          functionCode: `
            // Дані від чату
            const chatMessage = "${lastUserMessage.replace(/"/g, '\\"')}";
            
            // Тут можна додати додаткову логіку обробки
            
            return {
              json: {
                message: chatMessage,
                timestamp: new Date().toISOString(),
                source: "ReChat"
              }
            };
          `
        },
        name: "Обробка запиту",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [500, 300]
      }
    ],
    connections: {
      "Schedule Trigger": {
        main: [
          [
            {
              node: "Обробка запиту",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    }
  };

  return workflow;
}; 