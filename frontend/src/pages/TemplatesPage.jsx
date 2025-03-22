import React, { useState } from 'react';

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('popularity');

  const categories = [
    { id: 'all', name: 'Усі шаблони' },
    { id: 'data', name: 'Автоматизація даних' },
    { id: 'content', name: 'Робота з контентом' },
    { id: 'integration', name: 'Інтеграції' },
    { id: 'communication', name: 'Комунікація' },
    { id: 'analytics', name: 'Аналітика' }
  ];

  // Функція для відображення шаблонів на основі обраної категорії та пошуку
  const getFilteredTemplates = () => {
    // Тут буде логіка фільтрації шаблонів
    return templates;
  };

  // Макет шаблонів
  const templates = [
    {
      id: 1,
      title: 'Автоматичний збір та аналіз даних',
      description: 'Автоматизуйте регулярне збирання даних з різних джерел та отримуйте аналітичні звіти.',
      category: 'data',
      usageCount: 352,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-indigo-600',
      icon: 'document'
    },
    {
      id: 2,
      title: 'Розсилка оновлень клієнтам',
      description: 'Автоматична розсилка повідомлень про оновлення продукту або послуги вашим клієнтам.',
      category: 'communication',
      usageCount: 189,
      gradientFrom: 'from-green-500',
      gradientTo: 'to-teal-600',
      icon: 'chat'
    },
    {
      id: 3,
      title: 'Інтеграція з Google Sheets',
      description: 'Підключіть свої Google таблиці для автоматичного оновлення та аналізу даних.',
      category: 'integration',
      usageCount: 432,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-pink-600',
      icon: 'connect'
    },
    {
      id: 4,
      title: 'Щотижневі аналітичні звіти',
      description: 'Отримуйте автоматичні щотижневі звіти з ключовими показниками вашого бізнесу.',
      category: 'analytics',
      usageCount: 276,
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-orange-600',
      icon: 'chart'
    },
    {
      id: 5,
      title: 'Генерація контенту для соцмереж',
      description: 'Автоматично створюйте пости для соціальних мереж на основі вашого контенту.',
      category: 'content',
      usageCount: 195,
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-600',
      icon: 'settings'
    },
    {
      id: 6,
      title: 'Автовідповідач для електронної пошти',
      description: 'Налаштуйте розумні автовідповіді на електронні листи в залежності від їх змісту.',
      category: 'communication',
      usageCount: 312,
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-blue-600',
      icon: 'mail'
    }
  ];

  // Функція для відображення іконки шаблону
  const getTemplateIcon = (iconName) => {
    switch (iconName) {
      case 'document':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'chat':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case 'connect':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        );
      case 'mail':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Шаблони</h1>
      
      <div className="flex flex-wrap -mx-4">
        {/* Категорії шаблонів */}
        <div className="w-full md:w-1/4 px-4 mb-8">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md dark:shadow-dark p-4 sticky top-4 border border-gray-200 dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Категорії</h2>
            <ul className="space-y-2">
              {categories.map(category => (
                <li 
                  key={category.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border/50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Список шаблонів */}
        <div className="w-full md:w-3/4 px-4">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Пошук шаблонів..."
                className="w-full p-2 pl-8 border dark:border-dark-border rounded bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select 
              className="border dark:border-dark-border rounded p-2 bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popularity">Сортувати за популярністю</option>
              <option value="name">Сортувати за назвою</option>
              <option value="date">Сортувати за датою</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter(template => selectedCategory === 'all' || template.category === selectedCategory)
              .filter(template => template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  template.description.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(template => (
                <div key={template.id} className="bg-white dark:bg-dark-card rounded-lg shadow-md dark:shadow-dark overflow-hidden border border-gray-200 dark:border-dark-border transition-transform hover:transform hover:-translate-y-1">
                  <div className={`h-36 bg-gradient-to-r ${template.gradientFrom} ${template.gradientTo} flex items-center justify-center text-white`}>
                    {getTemplateIcon(template.icon)}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-2">
                      {categories.find(c => c.id === template.category)?.name || template.category}
                    </span>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{template.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{template.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Використано: {template.usageCount} разів</span>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">Використати</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
              Завантажити більше
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
