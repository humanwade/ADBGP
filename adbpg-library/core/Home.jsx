// client/core/Home.jsx
import React from 'react'
import { Box } from '@mui/material'
import DashboardWidgets from './DashboardWidgets'

export default function Home(){
  return (
    <Box sx={{p:3}}>
      <DashboardWidgets />
    </Box>
  )
}
