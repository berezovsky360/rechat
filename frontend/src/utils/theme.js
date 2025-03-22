// Функція для перевірки, чи система користувача має налаштування темної теми
const systemPrefersDark = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Функція для встановлення теми
const setTheme = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// Функція для ініціалізації теми
const initTheme = () => {
  // Перевіряємо, чи є збережена тема у localStorage
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    setTheme(true);
  } else if (savedTheme === 'light') {
    setTheme(false);
  } else {
    // Якщо теми не збережено, використовуємо системні налаштування
    setTheme(systemPrefersDark());
  }
};

// Функція для переключення теми
const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(!isDark);
  return !isDark;
};

export { initTheme, toggleTheme, setTheme, systemPrefersDark }; 