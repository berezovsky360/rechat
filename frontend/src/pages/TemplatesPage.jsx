import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const templatesPerPage = 12;
  
  // Категорії шаблонів
  const categories = [
    { id: 'all', name: 'Всі категорії' },
    { id: 'ai', name: 'AI' },
    { id: 'secops', name: 'SecOps' },
    { id: 'sales', name: 'Sales' },
    { id: 'itops', name: 'IT Ops' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'devops', name: 'DevOps' },
    { id: 'building-blocks', name: 'Building Blocks' },
    { id: 'design', name: 'Design' },
    { id: 'finance', name: 'Finance' },
    { id: 'hr', name: 'HR' },
    { id: 'other', name: 'Other' },
    { id: 'product', name: 'Product' },
    { id: 'support', name: 'Support' }
  ];
  
  // Імітація завантаження шаблонів
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      
      // Імітація запиту до API
      setTimeout(() => {
        // Генеруємо тестові дані
        const mockTemplates = Array.from({ length: 71 }, (_, i) => ({
          id: `template-${i + 1}`,
          name: `Шаблон робочого процесу ${i + 1}`,
          description: `Опис шаблону робочого процесу ${i + 1}. Цей шаблон демонструє можливості n8n для автоматизації задач.`,
          category: categories[Math.floor(Math.random() * categories.length)].id,
          nodes: Math.floor(Math.random() * 10) + 2,
          author: 'n8n Team',
          createdAt: new Date().toISOString()
        }));
        
        setTemplates(mockTemplates);
        setTotalPages(Math.ceil(mockTemplates.length / templatesPerPage));
        setLoading(false);
      }, 1500);
    };
    
    fetchTemplates();
  }, []);
  
  // Фільтрація шаблонів
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || template.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  // Пагінація
  const paginatedTemplates = filteredTemplates.slice(
    (page - 1) * templatesPerPage,
    page * templatesPerPage
  );
  
  // Обробка зміни сторінки
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Обробка зміни категорії
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };
  
  // Обробка зміни пошукового запиту
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Шаблони робочих процесів n8n
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Пошук шаблонів"
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
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Категорія</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                label="Категорія"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Знайдено {filteredTemplates.length} шаблонів
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {paginatedTemplates.map(template => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {template.name}
                    </Typography>
                    
                    <Chip 
                      label={categories.find(cat => cat.id === template.category)?.name || template.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description.length > 120 
                        ? `${template.description.substring(0, 120)}...` 
                        : template.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Вузлів: {template.nodes}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Автор: {template.author}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<VisibilityIcon />}
                    >
                      Переглянути
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<AddIcon />}
                      color="primary"
                    >
                      Використати
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={Math.ceil(filteredTemplates.length / templatesPerPage)} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TemplatesPage;
