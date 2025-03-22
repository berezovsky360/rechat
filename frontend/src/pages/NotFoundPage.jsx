import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Сторінку не знайдено</p>
      <p className="text-gray-600 mb-8">Сторінка, яку ви шукаєте, не існує або була переміщена.</p>
      <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Повернутися на головну
      </a>
    </div>
  );
};

export default NotFoundPage; 