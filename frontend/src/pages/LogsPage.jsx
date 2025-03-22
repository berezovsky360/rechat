import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState('panel1');
  
  // Імітація завантаження логів
  useEffect(() => {
    // Генеруємо тестові дані для логів додатку
    const mockLogs = Array.from({ length: 30 }, (_, i) => ({
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - i * 600000).toISOString(),
      level: ['info', 'warning', 'error', 'debug'][i % 4],
      message: `Лог повідомлення ${i + 1}: ${['Запит до API', 'Обробка даних', 'Генерація JSON', 'Помилка з\'єднання', 'Успішне виконання'][i % 5]}`,
      source: ['frontend', 'backend', 'api', 'system'][i % 4]
    }));
    
    // Генеруємо тестові дані для логів API
    const mockApiLogs = Array.from({ length: 20 }, (_, i) => ({
      id: `api-log-${i + 1}`,
      timestamp: new Date(Date.now() - i * 900000).toISOString(),
      endpoint: ['/api/n8n/workflows', '/api/openrouter/models', '/api/chat/completion', '/api/templates'][i % 4],
      method: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
      status: [200, 201, 400, 404, 500][i % 5],
      duration: Math.floor(Math.random() * 1000) + 50,
      requestSize: Math.floor(Math.random() * 10000) + 100,
      responseSize: Math.floor(Math.random() * 20000) + 200
    }));
    
    setLogs(mockLogs);
    setApiLogs(mockApiLogs);
  }, []);
  
  // Фільтрація логів за пошуковим запитом
  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.source.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Фільтрація API логів за пошуковим запитом
  const filteredApiLogs = apiLogs.filter(log => 
    log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.status.toString().includes(searchQuery)
  );
  
  // Обробка зміни пошукового запиту
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Обробка зміни розгорнутої панелі
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  // Отримання кольору для рівня логу
  const getLogLevelColor = (level) => {
    switch (level) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'debug':
        return 'default';
      default:
        return 'default';
    }
  };
  
  // Отримання кольору для статусу API
  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'info';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };
  
  // Очищення логів
  const handleClearLogs = (type) => {
    if (type === 'app') {
      setLogs([]);
    } else if (type === 'api') {
      setApiLogs([]);
    }
  };
  
  // Оновлення логів
  const handleRefreshLogs = () => {
    // Тут буде логіка оновлення логів з сервера
    console.log('Оновлення логів...');
  };
  
  // Завантаження логів
  const handleDownloadLogs = (type) => {
    // Тут буде логіка завантаження логів
    console.log(`Завантаження ${type} логів...`);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Логи системи
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Пошук в логах"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '50%' }}
          />
          
          <Box>
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={handleRefreshLogs}
              sx={{ mr: 1 }}
            >
              Оновити
            </Button>
            <Button 
              startIcon={<DownloadIcon />} 
              onClick={() => handleDownloadLogs('all')}
              color="primary"
            >
              Завантажити всі
            </Button>
          </Box>
        </Box>
        
        <Accordion 
          expanded={expanded === 'panel1'} 
          onChange={handleAccordionChange('panel1')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Логи додатку</Typography>
            <Chip 
              label={`${logs.length}`} 
              size="small" 
              color="primary" 
              sx={{ ml: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                startIcon={<DownloadIcon />} 
                onClick={() => handleDownloadLogs('app')}
                sx={{ mr: 1 }}
              >
                Завантажити
              </Button>
              <Button 
                startIcon={<DeleteIcon />} 
                onClick={() => handleClearLogs('app')}
                color="error"
              >
                Очистити
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Час</TableCell>
                    <TableCell>Рівень</TableCell>
                    <TableCell>Джерело</TableCell>
                    <TableCell>Повідомлення</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.level} 
                            size="small" 
                            color={getLogLevelColor(log.level)} 
                          />
                        </TableCell>
                        <TableCell>{log.source}</TableCell>
                        <TableCell>{log.message}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" sx={{ py: 2 }}>
                          Логи відсутні або не знайдено результатів за вашим запитом
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          expanded={expanded === 'panel2'} 
          onChange={handleAccordionChange('panel2')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Логи API</Typography>
            <Chip 
              label={`${apiLogs.length}`} 
              size="small" 
              color="primary" 
              sx={{ ml: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                startIcon={<DownloadIcon />} 
                onClick={() => handleDownloadLogs('api')}
                sx={{ mr: 1 }}
              >
                Завантажити
              </Button>
              <Button 
                startIcon={<DeleteIcon />} 
                onClick={() => handleClearLogs('api')}
                color="error"
              >
                Очистити
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Час</TableCell>
                    <TableCell>Метод</TableCell>
                    <TableCell>Ендпоінт</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Тривалість (мс)</TableCell>
                    <TableCell>Розмір запиту (байт)</TableCell>
                    <TableCell>Розмір відповіді (байт)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApiLogs.length > 0 ? (
                    filteredApiLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.method} 
                            size="small" 
                            color={
                              log.method === 'GET' ? 'info' :
                              log.method === 'POST' ? 'success' :
                              log.method === 'PUT' ? 'warning' :
                              log.method === 'DELETE' ? 'error' : 'default'
                            } 
                          />
                        </TableCell>
                        <TableCell>{log.endpoint}</TableCell>
                        <TableCell>
                          <Chip 
                            label={log.status} 
                            size="small" 
                            color={getStatusColor(log.status)} 
                          />
                        </TableCell>
                        <TableCell>{log.duration}</TableCell>
                        <TableCell>{log.requestSize}</TableCell>
                        <TableCell>{log.responseSize}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" sx={{ py: 2 }}>
                          Логи API відсутні або не знайдено результатів за вашим запитом
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default LogsPage;
