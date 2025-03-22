import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import TemplatesPage from './pages/TemplatesPage';

// Створюємо контекст додатку
export const AppContext = createContext();

const App = () => {
  // Централізований стан для зберігання API ключів та налаштувань
  const [appState, setAppState] = useState({
    openRouterApiKey: localStorage.getItem('openrouter_api_key') || '',
    n8nApiKey: localStorage.getItem('n8n_api_key') || '',
    n8nApiUrl: localStorage.getItem('n8n_api_url') || '',
    n8nWorkflowId: localStorage.getItem('n8n_workflow_id') || '',
    chatHistory: [],
    theme: localStorage.getItem('theme') || 'light',
    isAuthenticated: false,
    loading: true
  });

  // Завантаження історії чату при старті
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chat_history');
      if (savedHistory) {
        setAppState(prev => ({...prev, chatHistory: JSON.parse(savedHistory)}));
      }
    } catch (error) {
      console.error('Помилка при завантаженні історії чату:', error);
    }
    
    // Перевіряємо наявність API ключів для авторизації
    const isAuth = !!localStorage.getItem('openrouter_api_key') || 
                  (!!localStorage.getItem('n8n_api_key') && !!localStorage.getItem('n8n_api_url'));
    
    setAppState(prev => ({
      ...prev, 
      isAuthenticated: isAuth,
      loading: false
    }));
  }, []);

  // Функція для оновлення стану додатку
  const updateAppState = (newState) => {
    setAppState(prev => ({...prev, ...newState}));
    
    // Зберігаємо ключові параметри в localStorage
    if (newState.openRouterApiKey) localStorage.setItem('openrouter_api_key', newState.openRouterApiKey);
    if (newState.n8nApiKey) localStorage.setItem('n8n_api_key', newState.n8nApiKey);
    if (newState.n8nApiUrl) localStorage.setItem('n8n_api_url', newState.n8nApiUrl);
    if (newState.n8nWorkflowId) localStorage.setItem('n8n_workflow_id', newState.n8nWorkflowId);
    if (newState.chatHistory) localStorage.setItem('chat_history', JSON.stringify(newState.chatHistory));
    if (newState.theme) localStorage.setItem('theme', newState.theme);
  };

  // Функція для додавання повідомлення в історію чату
  const addToHistory = (userMessage, botResponse) => {
    const newHistoryItem = {
      id: Date.now(),
      query: userMessage.content,
      date: new Date().toISOString(),
      model: botResponse.model || 'Невідомо',
      status: botResponse.error ? 'error' : 'success',
      fullConversation: [userMessage, botResponse]
    };
    
    const updatedHistory = [newHistoryItem, ...appState.chatHistory];
    updateAppState({chatHistory: updatedHistory});
  };

  return (
    <AppContext.Provider value={{ 
      appState, 
      updateAppState,
      addToHistory
    }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
};

export default App;
