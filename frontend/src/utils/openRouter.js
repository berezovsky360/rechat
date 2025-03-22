// Файл для роботи з OpenRouter API

// Отримання API ключа з .env
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const BASE_URL = 'https://openrouter.ai/api/v1';

// Доступні моделі OpenRouter
export const openRouterModels = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'premium',
    description: 'Найновіша і найкраща модель від OpenAI з мультимодальними можливостями',
    maxTokens: 8192
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    category: 'premium',
    description: 'Найпотужніша модель від Anthropic з передовими можливостями',
    maxTokens: 8192
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    category: 'standard',
    description: 'Збалансована модель від Anthropic для більшості завдань',
    maxTokens: 8192
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    category: 'fast',
    description: 'Швидка і компактна модель від Anthropic',
    maxTokens: 4096
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    category: 'standard',
    description: 'Потужна модель від Google',
    maxTokens: 8192
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    category: 'standard',
    description: 'Флагманська модель від Mistral AI',
    maxTokens: 4096
  },
  {
    id: 'mistralai/mistral-7b',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    category: 'fast',
    description: 'Компактна та швидка модель від Mistral AI',
    maxTokens: 4096
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    provider: 'Meta',
    category: 'standard',
    description: 'Передова модель Llama 3 з відкритим кодом',
    maxTokens: 4096
  }
];

// Групування моделей за категоріями
export const modelCategories = {
  premium: 'Преміум моделі',
  standard: 'Стандартні моделі',
  fast: 'Швидкі моделі'
};

// Функція для відправки повідомлення
export const sendChatMessage = async (messages, model = 'openai/gpt-4o', maxTokens = 500) => {
  try {
    // Перевірка наявності API ключа
    if (!API_KEY) {
      throw new Error('OpenRouter API ключ не знайдено. Будь ласка, додайте VITE_OPENROUTER_API_KEY до .env файлу.');
    }

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin, // Важливо для обліку використання API
        'X-Title': 'ReChat'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Помилка при спілкуванні з OpenRouter API');
    }

    return await response.json();
  } catch (error) {
    console.error('Помилка OpenRouter:', error);
    throw error;
  }
};

// Функція для отримання списку доступних моделей з API
export const fetchAvailableModels = async () => {
  try {
    if (!API_KEY) {
      throw new Error('OpenRouter API ключ не знайдено');
    }

    const response = await fetch(`${BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin
      }
    });

    if (!response.ok) {
      throw new Error(`Помилка отримання моделей: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Помилка отримання моделей:', error);
    return { data: [] }; // Повертаємо пустий список у випадку помилки
  }
}; 