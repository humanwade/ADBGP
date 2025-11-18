// client/core/Menu.jsx
import React from 'react'
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import BookIcon from '@mui/icons-material/AutoStories'
import PeopleIcon from '@mui/icons-material/People'
import SwapIcon from '@mui/icons-material/SwapHoriz'
import ReportIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import { useNavigate } from 'react-router-dom'

const drawerWidth = 240

export default function Menu(){
  const nav = useNavigate()
  const items = [
    { label:'Home', icon:<HomeIcon />, to:'/' },
    { label:'Books', icon:<BookIcon />, to:'/books' },
    { label:'Patrons', icon:<PeopleIcon />, to:'/patrons' },
    { label:'Loans', icon:<SwapIcon />, to:'/loans' },
    { label:'Reports', icon:<ReportIcon />, to:'/reports' },
    { label:'Settings', icon:<SettingsIcon />, to:'/settings' },
  ]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width:drawerWidth,
        flexShrink:0,
        [`& .MuiDrawer-paper`]: { width:drawerWidth, boxSizing:'border-box' }
      }}
    >
      <Toolbar>
        <Box>
          <Typography variant="h6">Library</Typography>
          <Typography variant="caption" color="textSecondary">Staff Panel</Typography>
        </Box>
      </Toolbar>
      <List>
        {items.map(i => (
          <ListItemButton key={i.label} onClick={() => nav(i.to)}>
            <ListItemIcon>{i.icon}</ListItemIcon>
            <ListItemText primary={i.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}
