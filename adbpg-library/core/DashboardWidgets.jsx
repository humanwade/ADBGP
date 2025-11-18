// client/core/DashboardWidgets.jsx
import React, { useEffect, useState } from 'react'
import { Grid, Paper, Typography, Box } from '@mui/material'
import axios from 'axios'

function StatCard({title, value, subtitle}) {
  return (
    <Paper sx={{p:2}}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h4" sx={{fontWeight:600}}>{value}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </Paper>
  )
}

export default function DashboardWidgets(){
  const [stats, setStats] = useState({ books:0, patrons:0, loans:0, overdue:0 })

  useEffect(()=>{
    axios.get('/api/reports/stats').then(r => setStats(r.data)).catch(()=>{/* ignore */})
  },[])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Books" value={stats.books} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Patrons" value={stats.patrons} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Current Loans" value={stats.loans} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Overdue Loans" value={stats.overdue} subtitle={stats.overdue ? 'Action required' : 'All good'} />
        </Grid>
      </Grid>
    </Box>
  )
}
