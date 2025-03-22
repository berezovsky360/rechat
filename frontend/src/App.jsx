import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import TemplatesPage from './pages/TemplatesPage';

// Створюємо контекст додатку
export const AppContext = createContext();

const App = () => {
  return (
    <AppContext.Provider value={{ 
      appState, 
      updateAppState,
      addToHistory
    }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
};

export default App;
