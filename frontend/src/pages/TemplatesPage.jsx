import React from 'react';

const TemplatesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Шаблони</h1>
      
      <div className="flex flex-wrap -mx-4">
        {/* Категорії шаблонів */}
        <div className="w-full md:w-1/4 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Категорії</h2>
            <ul className="space-y-2">
              <li className="p-2 bg-blue-50 rounded-md text-blue-600 font-medium">Усі шаблони</li>
              <li className="p-2 hover:bg-gray-50 rounded-md">Автоматизація даних</li>
              <li className="p-2 hover:bg-gray-50 rounded-md">Робота з контентом</li>
              <li className="p-2 hover:bg-gray-50 rounded-md">Інтеграції</li>
              <li className="p-2 hover:bg-gray-50 rounded-md">Комунікація</li>
              <li className="p-2 hover:bg-gray-50 rounded-md">Аналітика</li>
            </ul>
          </div>
        </div>
        
        {/* Список шаблонів */}
        <div className="w-full md:w-3/4 px-4">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Пошук шаблонів..."
                className="w-full p-2 pl-8 border rounded"
              />
              <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select className="border rounded p-2">
              <option>Сортувати за популярністю</option>
              <option>Сортувати за назвою</option>
              <option>Сортувати за датою</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Карточка шаблону */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-blue-100 text-blue-600 mb-2">Автоматизація даних</span>
                <h3 className="text-lg font-semibold mb-2">Автоматичний збір та аналіз даних</h3>
                <p className="text-gray-600 text-sm mb-4">Автоматизуйте регулярне збирання даних з різних джерел та отримуйте аналітичні звіти.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Використано: 352 рази</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Використати</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-green-100 text-green-600 mb-2">Комунікація</span>
                <h3 className="text-lg font-semibold mb-2">Розсилка оновлень клієнтам</h3>
                <p className="text-gray-600 text-sm mb-4">Автоматична розсилка повідомлень про оновлення продукту або послуги вашим клієнтам.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Використано: 189 разів</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Використати</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-purple-100 text-purple-600 mb-2">Інтеграції</span>
                <h3 className="text-lg font-semibold mb-2">Інтеграція з Google Sheets</h3>
                <p className="text-gray-600 text-sm mb-4">Підключіть свої Google таблиці для автоматичного оновлення та аналізу даних.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Використано: 432 рази</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Використати</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center text-white">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-yellow-100 text-yellow-800 mb-2">Аналітика</span>
                <h3 className="text-lg font-semibold mb-2">Щотижневі аналітичні звіти</h3>
                <p className="text-gray-600 text-sm mb-4">Отримуйте автоматичні щотижневі звіти з ключовими показниками вашого бізнесу.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Використано: 276 разів</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Використати</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center text-white">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-red-100 text-red-600 mb-2">Робота з контентом</span>
                <h3 className="text-lg font-semibold mb-2">Генерація контенту для соцмереж</h3>
                <p className="text-gray-600 text-sm mb-4">Автоматично створюйте пости для соціальних мереж на основі вашого контенту.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Використано: 195 разів</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Використати</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-cyan-100 text-cyan-600 mb-2">Комунікація</span>
                <h3 className="text-lg font-semibold mb-2">Автовідповідач для електронної пошти</h3>
                <p className="text-gray-600 text-sm mb-4">Налаштуйте розумні автовідповіді на електронні листи в залежності від їх змісту.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Використано: 312 разів</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Використати</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Завантажити більше</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
