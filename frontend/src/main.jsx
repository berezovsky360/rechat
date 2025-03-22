import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { initTheme } from './utils/theme';

// Компонент для обробки помилок
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Помилка в компоненті:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Зберігаємо інформацію про помилку для налагодження
    localStorage.setItem('app_error', JSON.stringify({
      message: error.toString(),
      stack: error.stack,
      time: new Date().toISOString()
    }));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Щось пішло не так!</h1>
          <p className="mb-4">Спробуйте перезавантажити сторінку або повернутися на головну.</p>
          {this.state.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-2xl overflow-auto text-left">
              <p className="font-mono text-sm">{this.state.error.toString()}</p>
            </div>
          )}
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => window.location.href = '/'} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              На головну
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Перезавантажити
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Скинути дані
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Ініціалізуємо тему перед рендерингом
initTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ErrorBoundary>,
);
