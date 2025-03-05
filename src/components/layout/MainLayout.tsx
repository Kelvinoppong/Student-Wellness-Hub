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
      description: 'Overview of your wellness activities'
    },
    { 
      text: 'Book Appointment', 
      icon: <Schedule />, 
      path: '/appointments',
      description: 'Schedule a counseling appointment'
    },
    { 
      text: 'Mood Tracker', 
      icon: <EmojiEmotions />, 
      path: '/mood',
      description: 'Track and analyze your mood'
    },
    { 
      text: 'Study Breaks', 
      icon: <OndemandVideo />, 
      path: '/videos',
      description: 'Take a break with relaxing videos'
    },
    { 
      text: 'Meme Gallery', 
      icon: <TagFaces />, 
      path: '/memes',
      description: 'Enjoy some humor to brighten your day'
    },
    { 
      text: 'Weather & Wellness', 
      icon: <WbSunny />, 
      path: '/weather',
      description: 'Check weather and get wellness tips'
    },
    { 
      text: 'Mindfulness', 
      icon: <SelfImprovement />, 
      path: '/mindfulness',
      description: 'Guided meditations and mindfulness exercises'
    },
    { 
      text: 'Mental Health Resources', 
      icon: <Psychology />, 
      path: '/resources',
      description: 'Access mental health resources and support'
    },
  ];

  const drawer = (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 2,
        backgroundColor: theme.palette.primary.main,
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
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Your daily wellness companion
        </Typography>
      </Box>
      <Divider />
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
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(91, 138, 249, 0.12)'
                    : 'rgba(122, 160, 255, 0.12)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' 
                      ? 'rgba(91, 138, 249, 0.18)'
                      : 'rgba(122, 160, 255, 0.18)',
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(0, 0, 0, 0.04)'
                    : 'rgba(255, 255, 255, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 'medium' : 'normal' 
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