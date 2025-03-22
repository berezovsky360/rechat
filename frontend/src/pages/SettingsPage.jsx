import React, { useState } from 'react';
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

const SettingsPage = () => {
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [n8nApiUrl, setN8nApiUrl] = useState('https://domain.com/api/v1/docs');
  const [selectedModel, setSelectedModel] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [saveSettings, setSaveSettings] = useState(true);

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

  // Перевірка з'єднання з OpenRouter
  const testOpenRouterConnection = () => {
    if (!openRouterKey) {
      setSnackbarMessage('Будь ласка, введіть API ключ OpenRouter');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setTestingConnection(true);
    
    // Імітація перевірки з'єднання
    setTimeout(() => {
      setTestingConnection(false);
      setSnackbarMessage('З\'єднання з OpenRouter успішно встановлено');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 1500);
  };

  // Перевірка з'єднання з n8n
  const testN8nConnection = () => {
    if (!n8nApiKey || !n8nApiUrl) {
      setSnackbarMessage('Будь ласка, введіть API ключ та URL для n8n');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setTestingConnection(true);
    
    // Імітація перевірки з'єднання
    setTimeout(() => {
      setTestingConnection(false);
      setSnackbarMessage('З\'єднання з n8n успішно встановлено');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 1500);
  };

  // Збереження налаштувань
  const saveAllSettings = () => {
    if (!openRouterKey || !n8nApiKey || !n8nApiUrl || !selectedModel) {
      setSnackbarMessage('Будь ласка, заповніть всі необхідні поля');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Імітація збереження налаштувань
    setSnackbarMessage('Налаштування успішно збережено');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Налаштування
      </Typography>
      
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
        autoHideDuration={4000}
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
    </Box>
  );
};

export default SettingsPage;
