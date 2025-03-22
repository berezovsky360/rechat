import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';

const ChatPage = ({ workflowId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [selectedJson, setSelectedJson] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Прокрутка до останнього повідомлення
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Імітація відправки повідомлення та отримання відповіді
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Додаємо повідомлення користувача
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Імітація відповіді від сервера
    setTimeout(() => {
      // Приклад відповіді з JSON кодом
      const botMessage = {
        id: Date.now() + 1,
        text: 'Я створив робочий процес для вашого запиту. Ось результат:',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        steps: [
          'Створюю ноду для HTTP Request',
          'Налаштовую параметри запиту',
          'Додаю ноду для обробки відповіді',
          'З\'єдную ноди між собою'
        ],
        json: {
          "nodes": [
            {
              "parameters": {
                "url": "https://api.example.com/data",
                "authentication": "basicAuth",
                "method": "GET",
                "options": {}
              },
              "name": "HTTP Request",
              "type": "n8n-nodes-base.httpRequest",
              "typeVersion": 1,
              "position": [
                250,
                300
              ]
            },
            {
              "parameters": {
                "conditions": {
                  "string": [
                    {
                      "value1": "={{ $json.status }}",
                      "operation": "equal",
                      "value2": "success"
                    }
                  ]
                }
              },
              "name": "IF",
              "type": "n8n-nodes-base.if",
              "typeVersion": 1,
              "position": [
                450,
                300
              ]
            }
          ],
          "connections": {
            "HTTP Request": {
              "main": [
                [
                  {
                    "node": "IF",
                    "type": "main",
                    "index": 0
                  }
                ]
              ]
            }
          }
        }
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 2000);
  };

  // Обробка натискання Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Відкриття діалогу з JSON кодом
  const handleOpenJsonDialog = (json) => {
    setSelectedJson(JSON.stringify(json, null, 2));
    setJsonDialogOpen(true);
  };

  // Копіювання JSON коду
  const handleCopyJson = () => {
    navigator.clipboard.writeText(selectedJson);
    setSnackbarMessage('JSON скопійовано в буфер обміну');
    setSnackbarOpen(true);
  };

  // Додавання робочого процесу в n8n
  const handleAddToWorkflow = () => {
    // Тут буде логіка додавання в робочий процес n8n
    setSnackbarMessage('Робочий процес додано до n8n');
    setSnackbarOpen(true);
    setJsonDialogOpen(false);
  };

  // Анімація для кроків створення вузлів
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.5
      }
    })
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          p: 2, 
          mb: 2, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}>
            <Typography variant="h5" gutterBottom>
              Вітаємо в reChat!
            </Typography>
            <Typography variant="body1">
              Опишіть, який робочий процес n8n ви хочете створити
            </Typography>
          </Box>
        ) : (
          messages.map(message => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                
                {message.steps && (
                  <Box sx={{ mt: 2 }}>
                    {message.steps.map((step, index) => (
                      <motion.div
                        key={index}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={stepVariants}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: message.sender === 'user' ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                            my: 0.5 
                          }}
                        >
                          {step}
                        </Typography>
                      </motion.div>
                    ))}
                  </Box>
                )}
                
                {message.json && (
                  <Card sx={{ mt: 2, backgroundColor: 'background.default' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Згенерований робочий процес
                      </Typography>
                      <Typography variant="body2" component="pre" sx={{ 
                        mt: 1, 
                        p: 1, 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '100px'
                      }}>
                        {JSON.stringify(message.json, null, 2).substring(0, 150)}...
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleOpenJsonDialog(message.json)}
                      >
                        Показати JSON
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<AddIcon />}
                        onClick={() => handleAddToWorkflow()}
                      >
                        Додати в Workflow
                      </Button>
                    </CardActions>
                  </Card>
                )}
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1, 
                    color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary' 
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Paper>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Опишіть, який робочий процес n8n ви хочете створити..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={4}
          sx={{ mr: 1 }}
        />
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
      
      {/* Діалог для відображення повного JSON */}
      <Dialog
        open={jsonDialogOpen}
        onClose={() => setJsonDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>JSON код робочого процесу</DialogTitle>
        <DialogContent>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              backgroundColor: '#f5f5f5',
              maxHeight: '400px',
              overflow: 'auto'
            }}
          >
            <pre>{selectedJson}</pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyJson} startIcon={<ContentCopyIcon />}>
            Копіювати
          </Button>
          <Button onClick={handleAddToWorkflow} startIcon={<AddIcon />} color="primary">
            Додати в Workflow
          </Button>
          <Button onClick={() => setJsonDialogOpen(false)}>
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar для повідомлень */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatPage;
