import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SendIcon, UserIcon, BotIcon, ClearIcon, CopyIcon, CheckIcon } from "./ui/icons";
import { sendChatMessage, openRouterModels } from '../utils/openRouter';
import { executeWorkflow, convertChatToWorkflow, createWorkflow } from '../utils/n8nApi';

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copyState, setCopyState] = useState({});
  const [workflowJson, setWorkflowJson] = useState(null);
  const [workflowCreated, setWorkflowCreated] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Налаштування чату
  const [settings, setSettings] = useState({
    provider: "openrouter", // openrouter або n8n
    model: "openai/gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    apiKey: localStorage.getItem('openrouter_api_key') || "",
    n8nUrl: localStorage.getItem('n8n_api_url') || "",
    n8nApiKey: localStorage.getItem('n8n_api_key') || "",
    n8nWorkflow: localStorage.getItem('n8n_workflow_id') || "",
    systemPrompt: "Ви корисний асистент, який відповідає українською мовою.",
    streamResponse: true
  });

  // Список доступних моделей для OpenRouter
  const openRouterModels = [
    { id: "anthropic/claude-3-opus-20240229", name: "Claude 3 Opus", provider: "Anthropic" },
    { id: "anthropic/claude-3-sonnet-20240229", name: "Claude 3 Sonnet", provider: "Anthropic" },
    { id: "anthropic/claude-3-haiku-20240307", name: "Claude 3 Haiku", provider: "Anthropic" },
    { id: "google/gemini-1.5-pro-latest", name: "Gemini 1.5 Pro", provider: "Google" },
    { id: "google/gemini-1.0-pro-latest", name: "Gemini 1.0 Pro", provider: "Google" },
    { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B", provider: "Meta" },
    { id: "mistralai/mistral-large-latest", name: "Mistral Large", provider: "Mistral AI" },
    { id: "mistralai/mistral-medium", name: "Mistral Medium", provider: "Mistral AI" },
    { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI" },
    { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Зберігаємо ключі в localStorage
    if (settings.apiKey) localStorage.setItem('openrouter_api_key', settings.apiKey);
    if (settings.n8nUrl) localStorage.setItem('n8n_api_url', settings.n8nUrl);
    if (settings.n8nApiKey) localStorage.setItem('n8n_api_key', settings.n8nApiKey);
    if (settings.n8nWorkflow) localStorage.setItem('n8n_workflow_id', settings.n8nWorkflow);
  }, [settings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      role: "user",
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    setWorkflowCreated(false);
    setWorkflowJson(null);

    try {
      let botResponse;
      
      if (settings.provider === "openrouter") {
        // Реальний запит до OpenRouter API
        const allMessages = [
          { role: "system", content: settings.systemPrompt },
          ...messages.filter(m => m.role === "user" || m.role === "assistant"),
          userMessage
        ];
        
        const apiResponse = await sendChatMessage(
          allMessages, 
          settings.model, 
          settings.maxTokens,
          settings.temperature,
          settings.apiKey
        );
        
        botResponse = {
          role: "assistant",
          content: apiResponse.choices[0].message.content,
          timestamp: new Date().toISOString(),
          model: apiResponse.model
        };
      } else {
        // Запит до n8n workflow
        if (!settings.n8nWorkflow) {
          throw new Error("ID робочого процесу n8n не вказано. Будь ласка, додайте його в налаштуваннях.");
        }
        
        // Надсилаємо останнє повідомлення користувача до n8n workflow
        const apiResponse = await executeWorkflow(settings.n8nWorkflow, { 
          message: newMessage,
          allMessages: messages.concat(userMessage)
        });
        
        botResponse = {
          role: "assistant",
          content: apiResponse.data?.output || "Відповідь отримана, але не містить даних.",
          timestamp: new Date().toISOString(),
          workflowId: settings.n8nWorkflow
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
      
      // Якщо останнє повідомлення містить JSON структуру для workflow, зберігаємо її
      try {
        // Шукаємо JSON у відповіді
        const jsonMatch = botResponse.content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const workflowData = JSON.parse(jsonMatch[1]);
          setWorkflowJson(workflowData);
        }
      } catch (e) {
        console.log("Не вдалося розпізнати JSON у відповіді");
      }
      
    } catch (error) {
      // Обробка помилок
      setMessages(prev => [...prev, {
        role: "error",
        content: `Помилка: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!workflowJson) {
      // Створюємо workflow з повідомлень
      try {
        const workflow = convertChatToWorkflow(messages);
        const result = await createWorkflow(workflow);
        setWorkflowCreated(true);
        
        setMessages(prev => [...prev, {
          role: "system",
          content: `Workflow успішно створено! ID: ${result.id}`,
          timestamp: new Date().toISOString()
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          role: "error",
          content: `Помилка при створенні workflow: ${error.message}`,
          timestamp: new Date().toISOString()
        }]);
      }
    } else {
      // Якщо у нас є JSON для workflow, використовуємо його
      try {
        const result = await createWorkflow(workflowJson);
        setWorkflowCreated(true);
        
        setMessages(prev => [...prev, {
          role: "system",
          content: `Workflow успішно створено з JSON! ID: ${result.id}`,
          timestamp: new Date().toISOString()
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          role: "error",
          content: `Помилка при створенні workflow з JSON: ${error.message}`,
          timestamp: new Date().toISOString()
        }]);
      }
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setWorkflowJson(null);
    setWorkflowCreated(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (index) => {
    const message = messages[index];
    navigator.clipboard.writeText(message.content);
    
    setCopyState({ ...copyState, [index]: true });
    setTimeout(() => {
      setCopyState({ ...copyState, [index]: false });
    }, 2000);
  };

  const updateSettings = (key, value) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Додаємо detectWorkflowJson для пошуку JSON структури
  const hasWorkflowData = () => {
    return workflowJson !== null;
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Заголовок чату */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Чат</h1>
        <div className="flex gap-2">
          {(messages.length > 0 && settings.provider === "n8n") && (
            <Button 
              variant={workflowCreated ? "outline" : "default"} 
              size="sm" 
              onClick={handleCreateWorkflow}
              disabled={workflowCreated}
            >
              {workflowCreated ? "Workflow створено" : hasWorkflowData() ? "Створити з JSON" : "Створити Workflow"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleClearChat} disabled={messages.length === 0}>
            <ClearIcon className="h-4 w-4 mr-2" />
            Очистити
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
            Налаштування
          </Button>
        </div>
      </div>

      {/* Вікно чату */}
      <div className="flex-1 overflow-hidden flex flex-col bg-muted/30 rounded-md border mb-4">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <span className="text-4xl mb-2">💬</span>
              <h3 className="font-medium text-lg">Почніть розмову</h3>
              <p className="text-sm">Введіть повідомлення нижче, щоб почати спілкування з ШІ</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.role === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' : message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card dark:bg-card border'} rounded-lg px-4 py-2 shadow-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'user' ? (
                      <UserIcon className="h-4 w-4" />
                    ) : message.role === 'error' ? (
                      <span className="text-red-500">⚠️</span>
                    ) : message.role === 'system' ? (
                      <span className="text-blue-500">ℹ️</span>
                    ) : (
                      <BotIcon className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.role === 'user' ? 'Ви' : message.role === 'error' ? 'Помилка' : message.role === 'system' ? 'Система' : 'Асистент'}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  {message.role !== 'user' && message.role !== 'error' && (
                    <div className="flex justify-end mt-1">
                      <button 
                        onClick={() => handleCopyMessage(index)}
                        className="text-xs text-muted-foreground hover:text-foreground rounded p-1"
                      >
                        {copyState[index] ? (
                          <CheckIcon className="h-3 w-3" />
                        ) : (
                          <CopyIcon className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border rounded-lg px-4 py-2 shadow-sm max-w-[80%]">
                <div className="flex items-center gap-2 mb-1">
                  <BotIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Асистент</span>
                </div>
                <div className="flex space-x-1 items-center h-5">
                  <div className="bg-primary h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="bg-primary h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="bg-primary h-2 w-2 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле введення */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введіть повідомлення..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Діалог налаштувань */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Налаштування чату</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="provider" className="py-4">
            <TabsList className="mb-4">
              <TabsTrigger value="provider">Провайдер</TabsTrigger>
              <TabsTrigger value="model">Модель</TabsTrigger>
              <TabsTrigger value="advanced">Додатково</TabsTrigger>
            </TabsList>
            
            <TabsContent value="provider" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`flex flex-col items-center border rounded-md p-4 ${settings.provider === 'openrouter' ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}
                  onClick={() => updateSettings('provider', 'openrouter')}
                >
                  <div className="text-2xl mb-2">🤖</div>
                  <h3 className="font-medium">OpenRouter</h3>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Використовуйте різні LLM моделі через OpenRouter API
                  </p>
                </button>
                <button
                  className={`flex flex-col items-center border rounded-md p-4 ${settings.provider === 'n8n' ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}
                  onClick={() => updateSettings('provider', 'n8n')}
                >
                  <div className="text-2xl mb-2">🔄</div>
                  <h3 className="font-medium">n8n Workflow</h3>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Використовуйте робочі процеси n8n для обробки повідомлень
                  </p>
                </button>
              </div>
              
              {settings.provider === 'openrouter' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    OpenRouter API ключ
                  </label>
                  <Input
                    type="password"
                    placeholder="or-..."
                    value={settings.apiKey}
                    onChange={(e) => updateSettings('apiKey', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Отримайте API ключ на{" "}
                    <a 
                      href="https://openrouter.ai/keys" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      openrouter.ai/keys
                    </a>
                  </p>
                </div>
              )}
              
              {settings.provider === 'n8n' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      URL n8n серверу
                    </label>
                    <Input
                      placeholder="https://your-n8n-instance.com"
                      value={settings.n8nUrl}
                      onChange={(e) => updateSettings('n8nUrl', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      n8n API ключ
                    </label>
                    <Input
                      type="password"
                      placeholder="n8n_api_..."
                      value={settings.n8nApiKey}
                      onChange={(e) => updateSettings('n8nApiKey', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      ID робочого процесу n8n
                    </label>
                    <Input
                      placeholder="123"
                      value={settings.n8nWorkflow}
                      onChange={(e) => updateSettings('n8nWorkflow', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Введіть ID робочого процесу з вашого n8n сервера
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="model" className="space-y-4">
              {settings.provider === 'openrouter' && (
                <>
                  <label className="text-sm font-medium block mb-2">
                    Вибрати модель
                  </label>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {openRouterModels.map((model) => (
                      <div
                        key={model.id}
                        className={`flex items-center justify-between border rounded-md p-2 cursor-pointer ${
                          settings.model === model.id ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => updateSettings('model', model.id)}
                      >
                        <div>
                          <h3 className="font-medium">{model.name}</h3>
                          <p className="text-xs text-muted-foreground">{model.provider}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${
                          settings.model === model.id ? 'bg-primary' : 'border border-muted-foreground'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium">
                  Температура: {settings.temperature}
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">0</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => updateSettings('temperature', parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs">1</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Нижча температура - точніші відповіді, вища - креативніші
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Системний промпт
                </label>
                <textarea
                  className="w-full min-h-[100px] border border-gray-200 dark:border-gray-700 rounded-md p-2 text-sm"
                  value={settings.systemPrompt}
                  onChange={(e) => updateSettings('systemPrompt', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Інструкції для моделі, які визначають її поведінку
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Максимум токенів: {settings.maxTokens}
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">500</span>
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="100"
                    value={settings.maxTokens}
                    onChange={(e) => updateSettings('maxTokens', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs">4000</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Максимальна довжина відповіді
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Скасувати
            </Button>
            <Button onClick={() => setSettingsOpen(false)}>
              Зберегти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 