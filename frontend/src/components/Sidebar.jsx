import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Box,
  Typography
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import TemplateIcon from '@mui/icons-material/Description';
import LogsIcon from '@mui/icons-material/Assignment';

const drawerWidth = 240;

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { text: 'Чат', icon: <ChatIcon />, path: '/' },
    { text: 'Шаблони', icon: <TemplateIcon />, path: '/templates' },
    { text: 'Історія', icon: <HistoryIcon />, path: '/history' },
    { text: 'Логи', icon: <LogsIcon />, path: '/logs' },
    { text: 'Налаштування', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.2)',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            reChat v1.0.0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Powered by n8n & OpenRouter
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
