import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

const DEFAULT_WORKFLOWS = [
  { id: 1, name: "Обробка повідомлень", description: "Обробка повідомлень через OpenAI API", active: true, lastExecuted: "2023-09-15T10:30:00Z" },
  { id: 2, name: "Аналіз даних", description: "Аналіз та фільтрація даних", active: false, lastExecuted: null },
  { id: 3, name: "Інтеграція з CRM", description: "Передача даних до CRM системи", active: true, lastExecuted: "2023-09-14T16:45:00Z" },
];

export default function N8nPage() {
  const [serverUrl, setServerUrl] = useState("http://localhost:5678");
  const [apiKey, setApiKey] = useState("");
  const [workflows, setWorkflows] = useState(DEFAULT_WORKFLOWS);
  const [isConnectionTested, setIsConnectionTested] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [newWorkflow, setNewWorkflow] = useState({ name: "", description: "", workflowId: "" });

  const handleTestConnection = () => {
    if (!serverUrl || !apiKey) {
      setIsConnectionTested(false);
      return;
    }
    
    // Симуляція тестового API-запиту
    setTimeout(() => {
      setIsConnectionTested(true);
    }, 1000);
  };

  const handleToggleWorkflow = (id) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === id 
        ? { ...workflow, active: !workflow.active } 
        : workflow
    ));
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.workflowId) return;
    
    const newId = Math.max(...workflows.map(w => w.id), 0) + 1;
    
    setWorkflows([
      ...workflows,
      {
        id: newId,
        name: newWorkflow.name,
        description: newWorkflow.description,
        active: true,
        lastExecuted: null,
        workflowId: newWorkflow.workflowId
      }
    ]);
    
    setNewWorkflow({ name: "", description: "", workflowId: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Ніколи";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">n8n Інтеграція</h1>
        <Button onClick={handleTestConnection}>
          Перевірити підключення
        </Button>
      </div>
      
      {isConnectionTested !== null && (
        <div className={`p-4 rounded-md ${isConnectionTested ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
          {isConnectionTested 
            ? 'Підключення до n8n успішне!' 
            : 'Помилка підключення до n8n. Перевірте URL та API-ключ.'}
        </div>
      )}

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connection">Підключення</TabsTrigger>
          <TabsTrigger value="workflows">Робочі процеси</TabsTrigger>
          <TabsTrigger value="logs">Логи</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Налаштування підключення</CardTitle>
              <CardDescription>
                Налаштуйте URL та API ключ для підключення до n8n сервера.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="server-url" className="text-sm font-medium">
                  URL сервера
                </label>
                <Input
                  id="server-url"
                  placeholder="http://localhost:5678"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URL вашого n8n сервера, включаючи порт
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-sm font-medium">
                  API Ключ
                </label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="n8n_api_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  API ключ з вашого n8n сервера
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleTestConnection}>Зберегти і перевірити</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflows" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Робочі процеси</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Додати робочий процес</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Додати робочий процес</DialogTitle>
                  <DialogDescription>
                    Додайте новий робочий процес з n8n до вашого додатку.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="workflow-name" className="text-sm font-medium">
                      Назва
                    </label>
                    <Input
                      id="workflow-name"
                      placeholder="Обробка повідомлень"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="workflow-description" className="text-sm font-medium">
                      Опис
                    </label>
                    <Input
                      id="workflow-description"
                      placeholder="Опишіть призначення цього робочого процесу"
                      value={newWorkflow.description}
                      onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="workflow-id" className="text-sm font-medium">
                      ID робочого процесу
                    </label>
                    <Input
                      id="workflow-id"
                      placeholder="123"
                      value={newWorkflow.workflowId}
                      onChange={(e) => setNewWorkflow({...newWorkflow, workflowId: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      ID робочого процесу з вашого n8n сервера
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateWorkflow}>Створити</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className={workflow.active ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant={workflow.active ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleToggleWorkflow(workflow.id)}
                      >
                        {workflow.active ? "Активний" : "Неактивний"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    Останнє виконання: {formatDate(workflow.lastExecuted)}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm" onClick={() => setSelectedWorkflow(workflow)}>
                    Параметри
                  </Button>
                  <Button variant="ghost" size="sm">
                    Відкрити в n8n
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {workflows.length === 0 && (
              <div className="text-center p-6 border rounded-md text-muted-foreground">
                У вас ще немає робочих процесів. Створіть перший робочий процес, щоб почати.
              </div>
            )}
          </div>
          
          {selectedWorkflow && (
            <Dialog open={!!selectedWorkflow} onOpenChange={(open) => !open && setSelectedWorkflow(null)}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{selectedWorkflow.name}</DialogTitle>
                  <DialogDescription>
                    {selectedWorkflow.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Параметри виконання</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">Статус:</div>
                      <div className="text-sm font-medium">
                        {selectedWorkflow.active ? "Активний" : "Неактивний"}
                      </div>
                      <div className="text-sm">Останнє виконання:</div>
                      <div className="text-sm font-medium">
                        {formatDate(selectedWorkflow.lastExecuted)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Налаштування запитів</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">Метод:</div>
                      <div className="text-sm font-medium">POST</div>
                      <div className="text-sm">URL:</div>
                      <div className="text-sm font-medium overflow-hidden text-ellipsis">
                        {serverUrl}/webhook/{selectedWorkflow.id}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Тестові дані (JSON)</h3>
                    <div className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-20">
                      {`{
  "message": "Тестове повідомлення",
  "user": "user123",
  "timestamp": "${new Date().toISOString()}"
}`}
                    </div>
                  </div>
                </div>
                <DialogFooter className="space-x-2">
                  <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                    Закрити
                  </Button>
                  <Button>
                    Зберегти
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Логи виконань</CardTitle>
              <CardDescription>
                Перегляд логів виконання робочих процесів n8n.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="bg-muted p-2 text-sm font-medium grid grid-cols-12 gap-2">
                  <div className="col-span-2">Дата</div>
                  <div className="col-span-2">Робочий процес</div>
                  <div className="col-span-1">Статус</div>
                  <div className="col-span-7">Повідомлення</div>
                </div>
                <div className="p-4 text-center text-muted-foreground">
                  Немає даних про виконання робочих процесів
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Оновити</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 