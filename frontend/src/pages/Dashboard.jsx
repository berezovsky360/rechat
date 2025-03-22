import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Панель керування</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-dark border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Новий чат</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Розпочніть новий чат для створення робочого процесу</p>
          <Link 
            to="/chat" 
            className="inline-block px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Почати
          </Link>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-dark border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Шаблони</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Перегляньте готові шаблони робочих процесів</p>
          <Link 
            to="/templates" 
            className="inline-block px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            Переглянути
          </Link>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-dark border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Історія</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Перегляньте попередні запити та створені процеси</p>
          <Link 
            to="/history" 
            className="inline-block px-4 py-2 bg-purple-500 dark:bg-purple-600 text-white rounded hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
          >
            Переглянути
          </Link>
        </div>
      </div>
      
      <div className="mt-10 bg-white dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-dark border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Статистика</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded">
            <span className="block text-2xl font-bold text-blue-500 dark:text-blue-400">0</span>
            <span className="text-gray-600 dark:text-gray-300">Чатів</span>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded">
            <span className="block text-2xl font-bold text-green-500 dark:text-green-400">0</span>
            <span className="text-gray-600 dark:text-gray-300">Процесів</span>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded">
            <span className="block text-2xl font-bold text-purple-500 dark:text-purple-400">0</span>
            <span className="text-gray-600 dark:text-gray-300">Шаблонів</span>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded">
            <span className="block text-2xl font-bold text-orange-500 dark:text-orange-400">0</span>
            <span className="text-gray-600 dark:text-gray-300">Автоматизацій</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 