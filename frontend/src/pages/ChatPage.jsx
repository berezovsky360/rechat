import React from 'react';

const ChatPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Чат</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Новий запит</h2>
        </div>
        <div className="h-96 p-4 overflow-y-auto border-b bg-gray-50">
          {/* Тут буде чат */}
          <div className="mb-4 flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">К</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-sm">Привіт! Я готовий допомогти створити робочий процес для автоматизації завдань. Опишіть, що ви хочете автоматизувати.</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <form>
            <div className="flex">
              <textarea 
                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                rows="2" 
                placeholder="Введіть ваш запит тут..."
              ></textarea>
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                Надіслати
              </button>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <div className="flex items-center">
                <label className="mr-2">Модель:</label>
                <select className="border rounded p-1">
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3">Claude 3</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>
              <div>
                <button 
                  type="button" 
                  className="text-blue-500 hover:text-blue-700"
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
