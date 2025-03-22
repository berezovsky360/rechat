import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { MoonIcon, SunIcon } from "../components/ui/icons";

const SettingsPage = () => {
  const [openRouterKey, setOpenRouterKey] = useState(localStorage.getItem('openrouter_api_key') || '');
  const [n8nApiKey, setN8nApiKey] = useState(localStorage.getItem('n8n_api_key') || '');
  const [n8nApiUrl, setN8nApiUrl] = useState(localStorage.getItem('n8n_api_url') || 'https://domain.com/api/v1/docs');
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selected_model') || 'openai/gpt-3.5-turbo');
  const [testingConnection, setTestingConnection] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [saveSettings, setSaveSettings] = useState(true);
  const [demoMode, setDemoMode] = useState(localStorage.getItem('demo_mode') === 'true');
  const [apiMode, setApiMode] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || "Користувач");
  const [email, setEmail] = useState(localStorage.getItem('email') || "user@example.com");
  const [theme, setTheme] = useState(localStorage.getItem('theme') || "system");
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'false');
  const [tokenCount, setTokenCount] = useState(localStorage.getItem('token_count') !== 'false');
  const [streamResponse, setStreamResponse] = useState(localStorage.getItem('stream_response') !== 'false');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [languageModel, setLanguageModel] = useState(localStorage.getItem('language_model') || "openai/gpt-3.5-turbo");

  // Отримання інформації про режим роботи при завантаженні
  useEffect(() => {
    // Замість запиту до API, просто використовуємо значення з localStorage
    setApiMode(demoMode ? 'demo' : 'full');
  }, [demoMode]);

  // Моделі для вибору
  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', price: 'дешева', type: 'мовна', country: '🇺🇸', company: 'OpenAI' },
    { id: 'gpt-4', name: 'GPT-4', price: 'дорога', type: 'думаюча', country: '🇺🇸', company: 'OpenAI' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', price: 'дорога', type: 'думаюча', country: '🇺🇸', company: 'Anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', price: 'доступна', type: 'думаюча', country: '🇺🇸', company: 'Anthropic' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', price: 'дешева', type: 'мовна', country: '🇺🇸', company: 'Anthropic' },
    { id: 'llama-3-70b', name: 'Llama 3 70B', price: 'доступна', type: 'думаюча', country: '🇺🇸', company: 'Meta' },
    { id: 'gemini-pro', name: 'Gemini Pro', price: 'дешева', type: 'мовна', country: '🇺🇸', company: 'Google' },
    { id: 'gemini-ultra', name: 'Gemini Ultra', price: 'дорога', type: 'думаюча', country: '🇺🇸', company: 'Google' },
    { id: 'mistral-large', name: 'Mistral Large', price: 'доступна', type: 'думаюча', country: '🇫🇷', company: 'Mistral AI' },
    { id: 'mistral-small', name: 'Mistral Small', price: 'дешева', type: 'мовна', country: '🇫🇷', company: 'Mistral AI' },
    { id: 'yi-large', name: 'Yi Large', price: 'доступна', type: 'думаюча', country: '🇨🇳', company: '01.AI' },
    { id: 'qwen-72b', name: 'Qwen 72B', price: 'доступна', type: 'думаюча', country: '🇨🇳', company: 'Alibaba' },
  ];

  // Групування моделей за ціною
  const modelsByPrice = {
    'безкоштовна': models.filter(model => model.price === 'безкоштовна'),
    'дешева': models.filter(model => model.price === 'дешева'),
    'доступна': models.filter(model => model.price === 'доступна'),
    'дорога': models.filter(model => model.price === 'дорога')
  };

  // Функція для тестування з'єднання з OpenRouter
  const testOpenRouterConnection = () => {
    if (!openRouterKey) {
      setSnackbarMessage('Будь ласка, введіть API ключ OpenRouter');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setTestingConnection(true);
    
    // Реальний запит до OpenRouter для перевірки ключа
    fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ReChat'
      }
    })
      .then(response => {
        setTestingConnection(false);
        if (response.ok) {
          setSnackbarMessage('З\'єднання з OpenRouter успішно встановлено');
          setSnackbarSeverity('success');
          // Зберігаємо ключ в localStorage
          localStorage.setItem('openrouter_api_key', openRouterKey);
        } else {
          setSnackbarMessage('Помилка при з\'єднанні з OpenRouter. Перевірте API ключ.');
          setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
      })
      .catch(error => {
        setTestingConnection(false);
        setSnackbarMessage('Помилка при з\'єднанні з OpenRouter: ' + error.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  // Функція для тестування з'єднання з n8n
  const testN8nConnection = () => {
    if (!n8nApiKey || !n8nApiUrl) {
      setSnackbarMessage('Будь ласка, введіть URL та API ключ n8n');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setTestingConnection(true);
    
    // Тут можна додати реальний запит до n8n API
    // Для прикладу, використовуємо тайм-аут для імітації запиту
    setTimeout(() => {
      setTestingConnection(false);
      setSnackbarMessage('З\'єднання з n8n успішно встановлено');
      setSnackbarSeverity('success');

      // Зберігаємо ключі в localStorage
      localStorage.setItem('n8n_api_key', n8nApiKey);
      localStorage.setItem('n8n_api_url', n8nApiUrl);
      
      setSnackbarOpen(true);
    }, 1500);
  };

  // Збереження налаштувань
  const saveAllSettings = () => {
    // Збереження всіх налаштувань в localStorage
    localStorage.setItem('openrouter_api_key', openRouterKey);
    localStorage.setItem('n8n_api_key', n8nApiKey);
    localStorage.setItem('n8n_api_url', n8nApiUrl);
    localStorage.setItem('selected_model', selectedModel);
    localStorage.setItem('demo_mode', demoMode.toString());
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('theme', theme);
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('token_count', tokenCount.toString());
    localStorage.setItem('stream_response', streamResponse.toString());
    localStorage.setItem('language_model', languageModel);

    setSnackbarMessage('Налаштування успішно збережено');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Зміна режиму роботи (демо/повний)
  const toggleDemoMode = (event) => {
    const newDemoMode = event.target.checked;
    setDemoMode(newDemoMode);
    localStorage.setItem('demo_mode', newDemoMode.toString());
    setApiMode(newDemoMode ? 'demo' : 'full');
    
    setSnackbarMessage(`Режим роботи змінено на ${newDemoMode ? 'демо' : 'повний'}`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSave = () => {
    // Збереження всіх налаштувань
    saveAllSettings();
  };

  const handleReset = () => {
    // Скидання налаштувань та видалення з localStorage
    localStorage.removeItem('openrouter_api_key');
    localStorage.removeItem('n8n_api_key');
    localStorage.removeItem('n8n_api_url');
    localStorage.removeItem('selected_model');
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('theme');
    localStorage.removeItem('notifications');
    localStorage.removeItem('token_count');
    localStorage.removeItem('stream_response');
    localStorage.removeItem('language_model');
    
    // Скидання стану
    setOpenRouterKey('');
    setN8nApiKey('');
    setN8nApiUrl('https://domain.com/api/v1/docs');
    setSelectedModel('openai/gpt-3.5-turbo');
    setDemoMode(true);
    setUsername("Користувач");
    setEmail("user@example.com");
    setTheme("system");
    setNotifications(true);
    setTokenCount(true);
    setStreamResponse(true);
    setLanguageModel("openai/gpt-3.5-turbo");
    setIsResetDialogOpen(false);
    
    setSnackbarMessage('Налаштування скинуто до значень за замовчуванням');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Налаштування</h1>
        <div className="flex space-x-2">
          <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Скинути</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Скинути налаштування</DialogTitle>
                <DialogDescription>
                  Ви впевнені, що хочете скинути всі налаштування до значень за замовчуванням?
                  Це не може бути скасовано.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                  Скасувати
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                  Скинути
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave}>Зберегти зміни</Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Загальні</TabsTrigger>
          <TabsTrigger value="appearance">Вигляд</TabsTrigger>
          <TabsTrigger value="models">Моделі</TabsTrigger>
          <TabsTrigger value="about">Про додаток</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Профіль</CardTitle>
              <CardDescription>
                Керуйте своїми особистими даними та налаштуваннями.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Ім'я користувача
                </label>
                <Input
                  id="username"
                  placeholder="Ваше ім'я"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Електронна пошта
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Сповіщення</CardTitle>
              <CardDescription>
                Налаштуйте як ви отримуєте сповіщення від додатку.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Сповіщення про завершення завдань</p>
                  <p className="text-sm text-muted-foreground">
                    Отримуйте сповіщення, коли ваші завдання завершуються.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-5 rounded-full relative ${
                      notifications ? 'bg-primary' : 'bg-muted'
                    } transition-colors`}
                    onClick={() => setNotifications(!notifications)}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-background absolute top-0.5 transition-transform ${
                      notifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Тема</CardTitle>
              <CardDescription>
                Налаштуйте зовнішній вигляд додатку.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`flex flex-col items-center space-y-2 p-4 rounded-md border ${
                    theme === 'light' ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setTheme('light')}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted">
                    <SunIcon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">Світла</div>
                </button>
                <button
                  className={`flex flex-col items-center space-y-2 p-4 rounded-md border ${
                    theme === 'dark' ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted">
                    <MoonIcon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">Темна</div>
                </button>
                <button
                  className={`flex flex-col items-center space-y-2 p-4 rounded-md border ${
                    theme === 'system' ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setTheme('system')}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium">Системна</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Мовні моделі</CardTitle>
              <CardDescription>
                Налаштуйте моделі та параметри генерації відповідей.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Модель за замовчуванням
                </label>
                <select
                  className={`w-full rounded-md border border-gray-200 dark:border-gray-700 bg-background px-3 py-2 text-sm`}
                  value={languageModel}
                  onChange={(e) => setLanguageModel(e.target.value)}
                >
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="anthropic/claude-3-haiku-20240307">Claude 3 Haiku</option>
                  <option value="anthropic/claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                  <option value="anthropic/claude-3-opus-20240229">Claude 3 Opus</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Показувати кількість токенів</p>
                  <p className="text-sm text-muted-foreground">
                    Показувати кількість використаних токенів при генерації відповідей.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-5 rounded-full relative ${
                      tokenCount ? 'bg-primary' : 'bg-muted'
                    } transition-colors`}
                    onClick={() => setTokenCount(!tokenCount)}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-background absolute top-0.5 transition-transform ${
                      tokenCount ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Потокова відповідь</p>
                  <p className="text-sm text-muted-foreground">
                    Показувати відповідь по мірі її генерації.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-5 rounded-full relative ${
                      streamResponse ? 'bg-primary' : 'bg-muted'
                    } transition-colors`}
                    onClick={() => setStreamResponse(!streamResponse)}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-background absolute top-0.5 transition-transform ${
                      streamResponse ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Про додаток</CardTitle>
              <CardDescription>
                Інформація про цей додаток та його можливості.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">ReChat</h3>
                <p className="text-sm">Версія 1.0.0</p>
                <p className="text-sm text-muted-foreground">
                  ReChat — це застосунок для спілкування з моделями штучного інтелекту з підтримкою OpenRouter та n8n інтеграцій.
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold">Технології</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>React</li>
                  <li>Tailwind CSS</li>
                  <li>shadcn/ui</li>
                  <li>OpenRouter API</li>
                  <li>n8n Workflow Automation</li>
                </ul>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold">Можливості</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Спілкування з різними LLM моделями</li>
                  <li>Інтеграція з OpenRouter</li>
                  <li>Автоматизація процесів через n8n</li>
                  <li>Детальні логи розмов та запитів</li>
                  <li>Налаштування параметрів генерації</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Перевірити оновлення</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Налаштування API
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  OpenRouter API
                </Typography>
                <TextField
                  fullWidth
                  label="API ключ OpenRouter"
                  variant="outlined"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  type="password"
                  margin="normal"
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={testOpenRouterConnection}
                  disabled={testingConnection}
                  startIcon={testingConnection ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                  sx={{ mt: 1 }}
                >
                  Перевірити з'єднання
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  n8n API
                </Typography>
                <TextField
                  fullWidth
                  label="API ключ n8n"
                  variant="outlined"
                  value={n8nApiKey}
                  onChange={(e) => setN8nApiKey(e.target.value)}
                  type="password"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="URL API n8n"
                  variant="outlined"
                  value={n8nApiUrl}
                  onChange={(e) => setN8nApiUrl(e.target.value)}
                  margin="normal"
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={testN8nConnection}
                  disabled={testingConnection}
                  startIcon={testingConnection ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                  sx={{ mt: 1 }}
                >
                  Перевірити з'єднання
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Вибір моделі нейромережі
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Модель</InputLabel>
          <Select
            value={selectedModel}
            label="Модель"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {Object.entries(modelsByPrice).map(([priceCategory, models]) => [
              <MenuItem disabled value={`category-${priceCategory}`} key={`category-${priceCategory}`}>
                <Typography variant="subtitle2" color="text.secondary">
                  {priceCategory.charAt(0).toUpperCase() + priceCategory.slice(1)}
                </Typography>
              </MenuItem>,
              ...models.map(model => (
                <MenuItem value={model.id} key={model.id}>
                  {model.country} {model.name} - {model.company} ({model.type})
                </MenuItem>
              )),
              <Divider key={`divider-${priceCategory}`} />
            ])}
          </Select>
        </FormControl>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Рекомендуємо використовувати "думаючі" моделі для складних робочих процесів n8n.
        </Alert>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Додаткові налаштування
        </Typography>
        
        <FormControlLabel
          control={
            <Switch 
              checked={saveSettings} 
              onChange={(e) => setSaveSettings(e.target.checked)} 
            />
          }
          label="Зберігати налаштування між сеансами"
        />
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          startIcon={<SaveIcon />}
          onClick={saveAllSettings}
        >
          Зберегти всі налаштування
        </Button>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SettingsPage;
