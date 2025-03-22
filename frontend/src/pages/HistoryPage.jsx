import React from 'react';

const HistoryPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Історія</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Ваші запити</h2>
          <div className="flex">
            <input 
              type="text" 
              placeholder="Пошук..." 
              className="border rounded p-2 mr-2"
            />
            <select className="border rounded p-2">
              <option value="">Усі моделі</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3">Claude 3</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Запит</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Модель</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Приклад рядка таблиці */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#1001</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                  Створити робочий процес для інтеграції з Google Drive
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023-03-22 14:30
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  GPT-4
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Успішно
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Переглянути</button>
                  <button className="text-red-500 hover:text-red-700">Видалити</button>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#1002</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                  Створити робочий процес для надсилання щотижневих звітів електронною поштою
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023-03-21 10:15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Claude 3
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Успішно
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Переглянути</button>
                  <button className="text-red-500 hover:text-red-700">Видалити</button>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#1003</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                  Робочий процес для моніторингу соціальних мереж
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023-03-20 09:45
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Gemini Pro
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Помилка
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Переглянути</button>
                  <button className="text-red-500 hover:text-red-700">Видалити</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Показано 3 з 20 записів
          </div>
          <div className="flex">
            <button className="px-3 py-1 border rounded mr-2 bg-gray-100">Попередня</button>
            <button className="px-3 py-1 border rounded bg-blue-500 text-white">Наступна</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
