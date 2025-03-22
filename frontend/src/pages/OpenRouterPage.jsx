import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { SettingsIcon } from "../components/ui/icons";

const DEFAULT_MODELS = [
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

export default function OpenRouterPage() {
  const [apiKey, setApiKey] = useState("");
  const [models, setModels] = useState(DEFAULT_MODELS);
  const [activeModels, setActiveModels] = useState(DEFAULT_MODELS.slice(0, 5).map(m => m.id));
  const [isTestSuccessful, setIsTestSuccessful] = useState(null);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);

  const handleTestConnection = () => {
    if (!apiKey) {
      setIsTestSuccessful(false);
      return;
    }
    
    // Симуляція тестового API-запиту
    setTimeout(() => {
      setIsTestSuccessful(true);
    }, 1000);
  };

  const handleToggleModel = (modelId) => {
    if (activeModels.includes(modelId)) {
      setActiveModels(activeModels.filter(id => id !== modelId));
    } else {
      setActiveModels([...activeModels, modelId]);
    }
  };

  const moveModelUp = (index) => {
    if (index === 0) return;
    const newActiveModels = [...activeModels];
    const temp = newActiveModels[index];
    newActiveModels[index] = newActiveModels[index - 1];
    newActiveModels[index - 1] = temp;
    setActiveModels(newActiveModels);
  };

  const moveModelDown = (index) => {
    if (index === activeModels.length - 1) return;
    const newActiveModels = [...activeModels];
    const temp = newActiveModels[index];
    newActiveModels[index] = newActiveModels[index + 1];
    newActiveModels[index + 1] = temp;
    setActiveModels(newActiveModels);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">OpenRouter</h1>
        <Button onClick={handleTestConnection}>
          Перевірити підключення
        </Button>
      </div>
      
      {isTestSuccessful !== null && (
        <div className={`p-4 rounded-md ${isTestSuccessful ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
          {isTestSuccessful 
            ? 'Підключення до OpenRouter успішне!' 
            : 'Помилка підключення до OpenRouter. Перевірте API-ключ.'}
        </div>
      )}

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API налаштування</TabsTrigger>
          <TabsTrigger value="models">Моделі</TabsTrigger>
          <TabsTrigger value="usage">Використання</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API налаштування</CardTitle>
              <CardDescription>
                Налаштуйте свій OpenRouter API ключ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="api-key" className="text-sm font-medium">
                  API Ключ
                </label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="or-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
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
            </CardContent>
            <CardFooter>
              <Button onClick={handleTestConnection}>Зберегти і перевірити</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Моделі</CardTitle>
              <CardDescription>
                Керуйте моделями, які доступні у вашому додатку.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Доступні моделі</h3>
                  <p className="text-xs text-muted-foreground">
                    Ввімкніть моделі, які ви хочете використовувати у додатку.
                  </p>
                </div>
                <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Змінити порядок
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Змінити порядок моделей</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                      {activeModels.map((modelId, index) => {
                        const model = models.find(m => m.id === modelId);
                        return (
                          <div key={modelId} className="flex items-center justify-between border rounded-md p-2">
                            <div className="flex-1">
                              <div className="font-medium">{model?.name}</div>
                              <div className="text-xs text-muted-foreground">{model?.provider}</div>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveModelUp(index)}
                                disabled={index === 0}
                              >
                                ▲
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveModelDown(index)}
                                disabled={index === activeModels.length - 1}
                              >
                                ▼
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    className={`border rounded-md p-4 transition-colors ${
                      activeModels.includes(model.id) 
                        ? 'border-primary' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => handleToggleModel(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.provider}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${
                        activeModels.includes(model.id) 
                          ? 'bg-primary' 
                          : 'border border-muted-foreground'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Використання API</CardTitle>
              <CardDescription>
                Перегляд витрат та використання API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Загальні витрати</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Поточний місяць</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">$0.00</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Попередній місяць</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">$0.00</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Загалом</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">$0.00</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Використання за моделями</h3>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 border-b font-medium text-xs p-2">
                      <div className="col-span-4">Модель</div>
                      <div className="col-span-2 text-right">Запити</div>
                      <div className="col-span-3 text-right">Токени вводу</div>
                      <div className="col-span-3 text-right">Токени виводу</div>
                    </div>
                    <div className="p-4 text-center text-muted-foreground">
                      Немає даних про використання
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 