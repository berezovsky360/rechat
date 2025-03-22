import React, { useState, useEffect } from 'react';
import { openRouterModels, modelCategories } from '../utils/openRouter';

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Отримуємо поточну модель
  const currentModel = openRouterModels.find(model => model.id === selectedModel) || openRouterModels[0];

  // Групуємо моделі за категоріями
  const groupedModels = {};
  
  openRouterModels.forEach(model => {
    if (!groupedModels[model.category]) {
      groupedModels[model.category] = [];
    }
    groupedModels[model.category].push(model);
  });

  // Закриття селектора при кліку за його межами
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && e.target.closest('[data-model-selector]') === null) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Обробка вибору моделі
  const handleSelectModel = (modelId) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative" data-model-selector>
      <div className="flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 rounded-lg p-2 border border-gray-200 dark:border-dark-border text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
        >
          <span className="text-gray-800 dark:text-gray-200">{currentModel.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{currentModel.provider}</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border z-10">
          <div className="p-2 max-h-96 overflow-y-auto">
            {Object.keys(groupedModels).map(category => (
              <div key={category} className="mb-3">
                <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {modelCategories[category]}
                </div>
                
                <div className="mt-1">
                  {groupedModels[category].map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleSelectModel(model.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        model.id === currentModel.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-border/50'
                      }`}
                    >
                      <div className="font-medium flex justify-between">
                        <span>{model.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{model.provider}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {model.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 