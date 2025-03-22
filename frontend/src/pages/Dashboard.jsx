import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель керування</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Новий чат</h2>
          <p className="text-gray-600 mb-4">Розпочніть новий чат для створення робочого процесу</p>
          <a 
            href="/chat" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Почати
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Шаблони</h2>
          <p className="text-gray-600 mb-4">Перегляньте готові шаблони робочих процесів</p>
          <a 
            href="/templates" 
            className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Переглянути
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Історія</h2>
          <p className="text-gray-600 mb-4">Перегляньте попередні запити та створені процеси</p>
          <a 
            href="/history" 
            className="inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Переглянути
          </a>
        </div>
      </div>
      
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Статистика</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded">
            <span className="block text-2xl font-bold text-blue-500">0</span>
            <span className="text-gray-600">Чатів</span>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <span className="block text-2xl font-bold text-green-500">0</span>
            <span className="text-gray-600">Процесів</span>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <span className="block text-2xl font-bold text-purple-500">0</span>
            <span className="text-gray-600">Шаблонів</span>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <span className="block text-2xl font-bold text-orange-500">0</span>
            <span className="text-gray-600">Автоматизацій</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 