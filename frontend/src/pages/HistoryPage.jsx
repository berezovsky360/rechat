import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Імітація завантаження історії запитів
  useEffect(() => {
    // Генеруємо тестові дані
    const mockHistory = Array.from({ length: 50 }, (_, i) => ({
      id: `request-${i + 1}`,
      prompt: `Запит ${i + 1}: Створити робочий процес для ${['інтеграції з Google Drive', 'відправки повідомлень в Telegram', 'обробки даних з API', 'автоматизації маркетингу', 'моніторингу системи'][i % 5]}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      status: ['успішно', 'успішно', 'успішно', 'помилка', 'в обробці'][i % 5],
      nodes: Math.floor(Math.random() * 10) + 1,
      model: ['gpt-4', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro', 'mistral-large'][i % 5]
    }));
    
    setHistory(mockHistory);
  }, []);
  
  // Фільтрація історії за пошуковим запитом
  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Обробка зміни сторінки
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Обробка зміни кількості рядків на сторінці
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Обробка зміни пошукового запиту
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  
  // Видалення запису з історії
  const handleDeleteHistoryItem = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };
  
  // Перегляд деталей запиту
  const handleViewHistoryItem = (id) => {
    console.log(`Перегляд деталей запиту ${id}`);
    // Тут буде логіка для відображення деталей запиту
  };
  
  // Отримання кольору для статусу
  const getStatusColor = (status) => {
    switch (status) {
      case 'успішно':
        return 'success';
      case 'помилка':
        return 'error';
      case 'в обробці':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Історія запитів
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Пошук в історії"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Запит</TableCell>
                <TableCell>Дата і час</TableCell>
                <TableCell>Модель</TableCell>
                <TableCell>Вузлів</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.prompt.length > 60 
                        ? `${row.prompt.substring(0, 60)}...` 
                        : row.prompt}
                    </TableCell>
                    <TableCell>
                      {new Date(row.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.nodes}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        color={getStatusColor(row.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewHistoryItem(row.id)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteHistoryItem(row.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Історія запитів порожня або не знайдено результатів за вашим запитом
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Рядків на сторінці:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} з ${count}`}
        />
      </Paper>
    </Box>
  );
};

export default HistoryPage;
