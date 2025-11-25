import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, bgcolor: '#f5f5f5', p: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}