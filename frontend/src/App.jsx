import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import ChatUI from "./components/ChatUI";
import LogsPage from "./pages/LogsPage";
import OpenRouterPage from "./pages/OpenRouterPage";
import N8nPage from "./pages/N8nPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkTheme(e.matches);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <BrowserRouter>
      <ThemeProvider forcedTheme={isDarkTheme ? "dark" : "light"}>
        <div className="flex min-h-screen bg-background font-sans antialiased">
          <Sidebar />
          <div className="flex-1 ml-16">
            <Header toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
            <main className="px-4 pt-4 md:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<ChatUI />} />
                <Route path="/openrouter" element={<OpenRouterPage />} />
                <Route path="/n8n" element={<N8nPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/logs" element={<LogsPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
