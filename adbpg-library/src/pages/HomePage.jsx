import React from 'react'
import { Box } from '@mui/material'

import DashboardWidgets from '../features/dashboard/components/DashboardWidgets'
import LoanListPage from './LoanListPage'

export default function HomePage() {
  const userRole = localStorage.getItem('role');

  if (userRole === 'PATRON') {
    return <LoanListPage />
  }

  return (
    <Box sx={{ p: 3 }}>
      <DashboardWidgets />
    </Box>
  )
}