import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  EmojiEmotions,
  OndemandVideo,
  TagFaces,
  WbSunny,
  ExitToApp,
  Brightness4,
  Brightness7,
  Notifications,
  SelfImprovement,
  Psychology,
  Schedule,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { ColorModeContext } from '../../contexts/ColorModeContext';
import { signOutUser } from '../../services/auth';

const drawerWidth = 240;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOutUser();
      // Force a page reload after logout to clear any cached states
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard',
      description: 'Your personal wellness overview'
    },
    { 
      text: 'Mood Check-In', 
      icon: <EmojiEmotions />, 
      path: '/mood',
      description: 'Track your mood and emotional well-being'
    },
    { 
      text: 'Talk to Someone', 
      icon: <Schedule />, 
      path: '/appointments',
      description: 'Schedule a confidential counseling session'
    },
    { 
      text: 'Mindfulness', 
      icon: <SelfImprovement />, 
      path: '/mindfulness',
      description: 'Guided meditation and relaxation exercises'
    },
    { 
      text: 'Positive Break', 
      icon: <TagFaces />, 
      path: '/memes',
      description: 'Take a moment to smile with uplifting content'
    },
    { 
      text: 'Study Break Videos', 
      icon: <OndemandVideo />, 
      path: '/videos',
      description: 'Relaxing videos to help you unwind'
    },
    { 
      text: 'Wellness Tips', 
      icon: <WbSunny />, 
      path: '/weather',
      description: 'Daily wellness tips and weather-based activities'
    },
    { 
      text: 'Mental Health Resources', 
      icon: <Psychology />, 
      path: '/resources',
      description: 'Access helpful mental health information and support'
    },
  ];

  const drawer = (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 2,
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(to bottom right, #5B8AF9, #83A8FF)'
          : 'linear-gradient(to bottom right, #3F6AD4, #5B8AF9)',
        color: theme.palette.primary.contrastText
      }}>
        <Avatar 
          sx={{ 
            width: 60, 
            height: 60, 
            mb: 1,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          {user?.displayName?.charAt(0) || 'S'}
        </Avatar>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          Student Wellness Hub
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center', mt: 1 }}>
          You're not alone. We're here to support you.
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, pl: 2 }}>
          Your Wellness Journey
        </Typography>
      </Box>
      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <Tooltip title={item.description} placement="right" key={item.text}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: 'all 0.2s ease-in-out',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(91, 138, 249, 0.12)'
                    : 'rgba(122, 160, 255, 0.12)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' 
                      ? 'rgba(91, 138, 249, 0.18)'
                      : 'rgba(122, 160, 255, 0.18)',
                    transform: 'translateX(4px)',
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(0, 0, 0, 0.04)'
                    : 'rgba(255, 255, 255, 0.04)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary,
                transition: 'color 0.2s ease-in-out'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                secondary={location.pathname === item.path ? item.description : null}
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 'medium' : 'normal',
                  fontSize: '0.95rem'
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  sx: { opacity: 0.8 }
                }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
        <Tooltip title="Logout">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              justifyContent: 'center',
              color: theme.palette.error.main,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto', mr: 1 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Tooltip>
        <Typography variant="caption" color="text.secondary" align="center">
          {new Date().getFullYear()} Student Wellness Hub<br />
          Take care of your mind and body
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div">
              {menuItems.find((item) => item.path === location.pathname)?.text || 'Student Wellness Hub'}
            </Typography>
          </Box>
          
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton color="inherit" onClick={colorMode.toggleColorMode} sx={{ mr: 1 }}>
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          
          {user && (
            <Tooltip title="Logout">
              <IconButton color="inherit" component={Link} to="/logout">
                <ExitToApp />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.mode === 'light' 
            ? 'rgba(248, 249, 255, 0.5)'
            : 'rgba(26, 26, 46, 0.5)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};