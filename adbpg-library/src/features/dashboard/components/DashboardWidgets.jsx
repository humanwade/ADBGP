import React, { useEffect, useState } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import axios from 'axios'
import StatCard from '../../../components/Common/StatCard' 

export default function DashboardWidgets() {
  const [stats, setStats] = useState({ books: 0, patrons: 0, loans: 0, overdue: 0 })

  useEffect(() => {
    axios.get('/api/reports/stats')
      .then(r => setStats(r.data))
      .catch(() => { /* ignore */ })
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Books" value={stats.books} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Patrons" value={stats.patrons} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Current Loans" value={stats.loans} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Overdue Loans" 
            value={stats.overdue} 
            subtitle={stats.overdue ? 'Action required' : 'All good'} 
          />
        </Grid>
      </Grid>
    </Box>
  )
}