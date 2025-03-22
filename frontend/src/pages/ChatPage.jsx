import React, { useState, useRef, useEffect } from 'react';
import ModelSelector from '../components/ModelSelector';
import { sendChatMessage } from '../utils/openRouter';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Привіт! Я готовий допомогти створити робочий процес для автоматизації завдань. Опишіть, що ви хочете автоматизувати.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Прокручування до останнього повідомлення
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Відправка повідомлення
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Додаємо повідомлення користувача
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Підготуємо повідомлення для API
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Відправляємо запит до API
      const response = await sendChatMessage(apiMessages, selectedModel, 1000);
      
      // Додаємо відповідь до чату
      const assistantMessage = {
        id: Date.now().toString() + '-response',
        role: 'assistant',
        content: response.choices[0].message.content
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Помилка при відправці запиту:', error);
      
      // Додаємо повідомлення про помилку
      const errorMessage = {
        id: Date.now().toString() + '-error',
        role: 'system',
        content: `Виникла помилка: ${error.message}`
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Очищення історії чату
  const handleClearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Привіт! Я готовий допомогти створити робочий процес для автоматизації завдань. Опишіть, що ви хочете автоматизувати.'
    }]);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Чат</h1>
      
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md dark:shadow-dark overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Новий запит</h2>
        </div>
        
        {/* Область чату */}
        <div 
          ref={chatContainerRef}
          className="h-96 p-4 overflow-y-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg/50"
        >
          {messages.map(message => (
            <div key={message.id} className={`mb-4 flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role !== 'user' && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {message.role === 'assistant' ? 'A' : 'S'}
                  </div>
                </div>
              )}
              
              <div className={`p-3 rounded-lg max-w-3xl ${
                message.role === 'user' 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-gray-800 dark:text-gray-100' 
                  : message.role === 'assistant'
                    ? 'bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0 ml-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                    К
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Форма введення */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <textarea 
                className="flex-1 p-2 border dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-card dark:text-gray-100 resize-none" 
                rows="2" 
                placeholder="Введіть ваш запит тут..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              ></textarea>
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? 'Надсилання...' : 'Надіслати'}
              </button>
            </div>
            
            <div className="mt-2 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <label className="mr-2 text-gray-700 dark:text-gray-300">Модель:</label>
                <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              </div>
              
              <div>
                <button 
                  type="button" 
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={handleClearChat}
                  disabled={isLoading}
                >
                  Очистити історію
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
