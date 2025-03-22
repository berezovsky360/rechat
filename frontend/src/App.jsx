import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Компоненти
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Сторінки
import ChatPage from './pages/ChatPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';
import LogsPage from './pages/LogsPage';

// Створення теми
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Header />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              ml: { sm: 8 },
              overflow: 'auto',
              backgroundColor: 'background.default',
            }}
          >
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
