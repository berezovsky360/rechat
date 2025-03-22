import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const navItems = [
    { title: "Чат", path: "/", icon: "💬" },
    { title: "OpenRouter", path: "/openrouter", icon: "🤖" },
    { title: "n8n Workflows", path: "/n8n", icon: "🔄" },
    { title: "Налаштування", path: "/settings", icon: "⚙️" },
    { title: "Логи", path: "/logs", icon: "📊" }
  ];

  return (
    <div 
      className={`h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      } bg-card border-r border-border shadow-md flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        {isExpanded ? (
          <h2 className="font-bold">ReChat</h2>
        ) : (
          <span className="font-bold mx-auto">RC</span>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-muted"
        >
          {isExpanded ? "◀" : "▶"}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`flex items-center rounded-md p-2 hover:bg-muted/80 transition-colors ${
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {isExpanded && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
            U
          </div>
          {isExpanded && (
            <div>
              <div className="font-medium text-sm">Користувач</div>
              <div className="text-xs text-muted-foreground">user@example.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
