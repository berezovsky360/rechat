import { Routes, Route } from "react-router-dom";
import { ChatUI } from "./components/ChatUI";
import LogsPage from "./pages/LogsPage";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<ChatUI />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </div>
  );
}

export default App;
