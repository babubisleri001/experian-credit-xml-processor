import React from 'react';
import { 
  AppBar, 
  Box, 
  Container, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Assessment as AnalyticsIcon,
  Menu as MenuIcon,
  AccountBalance as BankIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useState } from 'react';

// Create a modern dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1419',
      paper: '#1a1f2e',
    },
    primary: {
      main: '#00d4ff',
      dark: '#00a8cc',
      light: '#00e5ff',
    },
    secondary: {
      main: '#7c3aed',
      dark: '#6d28d9',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b9c9',
    },
    divider: '#2a3141',
  },
  typography: {
    fontFamily: '"Sora", "Segoe UI", "Helvetica Neue", sans-serif',
  },
});

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Upload Report', path: '/upload', icon: <UploadIcon /> },
    { text: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  ];

  const isActive = (path) => window.location.pathname === path || (path === '/' && window.location.pathname === '/');

  const handleNavigation = (path) => {
    window.location.href = path;
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: '100%', background: 'linear-gradient(135deg, #1a1f2e 0%, #141829 100%)', height: '100%' }}>
      <Box sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)' }}>
        <Box sx={{ 
          position: 'relative', 
          mb: 2,
          display: 'inline-block',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(0, 212, 255, 0.7)' },
            '70%': { boxShadow: '0 0 0 10px rgba(0, 212, 255, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(0, 212, 255, 0)' },
          }
        }}>
          <Avatar sx={{ 
            bgcolor: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)', 
            mx: 'auto', 
            width: 64, 
            height: 64,
            fontSize: '2rem'
          }}>
            <BankIcon />
          </Avatar>
        </Box>
        <Typography variant="h5" fontWeight="800" color="primary" sx={{ letterSpacing: '-0.5px' }}>
          Credit Report
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
          Processing System
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
      <List sx={{ mt: 1 }}>
        {navigationItems.map((item) => (
          <ListItem 
            key={item.text}
            component="div"
            onClick={() => handleNavigation(item.path)}
            sx={{
              background: isActive(item.path) 
                ? 'linear-gradient(90deg, rgba(0, 212, 255, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)'
                : 'transparent',
              borderLeft: isActive(item.path) ? '3px solid #00d4ff' : '3px solid transparent',
              color: isActive(item.path) ? 'primary.main' : 'textSecondary',
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.08)',
              },
              borderRadius: '0 12px 12px 0',
              mx: 1,
              my: 1,
              px: 2.5,
              py: 1.5,
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(item.path) ? 'primary.main' : 'textSecondary',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 700 : 500,
                fontSize: '0.95rem'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        bgcolor: '#0f1419',
        overflow: 'hidden',
        width: '100%',
        position: 'relative'
      }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(90deg, rgba(26, 31, 46, 0.95) 0%, rgba(20, 24, 41, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
            borderColor: 'rgba(0, 212, 255, 0.1)',
            zIndex: theme.zIndex.appBar,
            width: '100%',
            left: 0,
            right: 0
          }}
        >
          <Toolbar sx={{ minHeight: 70, px: { xs: 2, md: 3 } }}>
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, '&:hover': { bgcolor: 'rgba(0, 212, 255, 0.1)' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1, gap: 2 }}>
              <Avatar sx={{ 
                bgcolor: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)', 
                width: 48, 
                height: 48,
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
              }}>
                <BankIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div" fontWeight="800" color="primary" sx={{ lineHeight: 1.1 }}>
                  Credit Report
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  PROCESSING SYSTEM
                </Typography>
              </Box>
            </Box>

            {!isMobile && (
              <Box display="flex" gap={1}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    startIcon={item.icon}
                    variant={isActive(item.path) ? 'contained' : 'text'}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      fontSize: '0.95rem',
                      borderRadius: 2,
                      px: 2,
                      background: isActive(item.path)
                        ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)'
                        : 'transparent',
                      color: isActive(item.path) ? 'primary.main' : 'textSecondary',
                      border: isActive(item.path) ? '1px solid rgba(0, 212, 255, 0.3)' : 'none',
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.12)',
                        color: 'primary.main'
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280,
                zIndex: theme.zIndex.drawer,
                bgcolor: '#1a1f2e'
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <IconButton onClick={handleDrawerToggle} sx={{ color: 'primary.main' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280,
                zIndex: theme.zIndex.drawer - 1,
                position: 'fixed',
                height: '100vh',
                borderRight: '1px solid rgba(0, 212, 255, 0.1)',
                bgcolor: '#1a1f2e',
                overflowX: 'hidden'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            width: { xs: '100%', md: 'calc(100% - 280px)' },
            ml: { xs: 0, md: '280px' },
            mt: '70px',
            bgcolor: '#0f1419',
            minHeight: 'calc(100vh - 70px)',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg, #0f1419 0%, #1a1620 100%)',
            overflow: 'hidden',
            maxWidth: '100vw',
            boxSizing: 'border-box'
          }}
        > 
          <Container 
            maxWidth={false} 
            disableGutters
            sx={{ 
              position: 'relative', 
              zIndex: 2, 
              bgcolor: 'transparent', 
              width: '100%',
              maxWidth: '100%',
              px: 0,
              overflow: 'hidden'
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;