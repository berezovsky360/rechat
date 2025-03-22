import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [notificationsCount, setNotificationsCount] = useState(0);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          reChat
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={notificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleSettingsClick} sx={{ mr: 2 }}>
            <SettingsIcon />
          </IconButton>
          <Avatar alt="User" src="/static/images/avatar/1.jpg" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
