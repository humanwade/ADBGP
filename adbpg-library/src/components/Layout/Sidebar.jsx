import React from 'react'
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box, Divider } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import BookIcon from '@mui/icons-material/AutoStories'
import PeopleIcon from '@mui/icons-material/People'
import SwapIcon from '@mui/icons-material/SwapHoriz'
import ReportIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/ExitToApp'
import HistoryIcon from '@mui/icons-material/History'

const drawerWidth = 240

export default function Sidebar() {
  const nav = useNavigate()
  const location = useLocation() 

  const userRole = localStorage.getItem('role') || 'PATRON';
  const userName = localStorage.getItem('user_name') || 'User';

  // Admin
  const adminItems = [
    { label: 'Dashboard', icon: <HomeIcon />, to: '/' },
    { label: 'Books', icon: <BookIcon />, to: '/books' },
    { label: 'Patrons', icon: <PeopleIcon />, to: '/patrons' },
    { label: 'Loans', icon: <SwapIcon />, to: '/loans' },
    { label: 'Reports', icon: <ReportIcon />, to: '/reports' },
    { label: 'Settings', icon: <SettingsIcon />, to: '/settings' },
  ]

  // Patron
  const patronItems = [
    { label: 'Search Books', icon: <BookIcon />, to: '/books' },
    { label: 'My Loans', icon: <HistoryIcon />, to: '/' },
  ]

  const menuItems = userRole === 'ADMIN' ? adminItems : patronItems;

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user_name');
      nav('/login');
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar>
        <Box>
          <Typography variant="h6" noWrap component="div">
            Library App
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
            {userName} ({userRole})
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => nav(item.to)}
            selected={location.pathname === item.to}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ marginTop: 'auto' }}>
        <Divider />
        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  )
}