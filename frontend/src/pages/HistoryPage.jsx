import React, { useState } from 'react';

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  
  // Дані про історію (заглушка)
  const historyItems = [
    {
      id: 1001,
      query: 'Створити робочий процес для інтеграції з Google Drive',
      date: '2023-03-22 14:30',
      model: 'GPT-4',
      status: 'success'
    },
    {
      id: 1002,
      query: 'Створити робочий процес для надсилання щотижневих звітів електронною поштою',
      date: '2023-03-21 10:15',
      model: 'Claude 3',
      status: 'success'
    },
    {
      id: 1003,
      query: 'Робочий процес для моніторингу соціальних мереж',
      date: '2023-03-20 09:45',
      model: 'Gemini Pro',
      status: 'error'
    }
  ];
  
  // Фільтрація історії
  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = modelFilter === '' || 
      item.model === modelFilter;
    
    return matchesSearch && matchesModel;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Історія</h1>
      
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md dark:shadow-dark p-6 border border-gray-200 dark:border-dark-border">
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Ваші запити</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              placeholder="Пошук..." 
              className="border dark:border-dark-border rounded p-2 bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="border dark:border-dark-border rounded p-2 bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100"
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
            >
              <option value="">Усі моделі</option>
              <option value="GPT-4">GPT-4</option>
              <option value="Claude 3">Claude 3</option>
              <option value="Gemini Pro">Gemini Pro</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Запит</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Модель</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {filteredHistory.length > 0 ? (
                filteredHistory.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{item.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-md truncate">
                      {item.query}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                      }`}>
                        {item.status === 'success' ? 'Успішно' : 'Помилка'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-2">Переглянути</button>
                      <button className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Видалити</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Немає записів, що відповідають критеріям пошуку
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            Показано {filteredHistory.length} з {historyItems.length} записів
          </div>
          <div className="flex">
            <button className="px-3 py-1 border dark:border-dark-border rounded mr-2 bg-gray-100 dark:bg-dark-bg/50 text-gray-700 dark:text-gray-300" disabled>Попередня</button>
            <button className="px-3 py-1 border dark:border-dark-border rounded bg-blue-500 text-white" disabled>Наступна</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
