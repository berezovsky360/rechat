import { useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "./ui/icons";

export function Header({ toggleTheme, isDarkTheme }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 sm:px-6 lg:px-16">
        <div className="ml-16 flex-1 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold tracking-tight">ReChat</h1>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">v1.0.0</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              title={isDarkTheme ? "Переключити на світлу тему" : "Переключити на темну тему"}
            >
              {isDarkTheme ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
