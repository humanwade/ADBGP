import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import ReportStats from '../features/report/components/ReportStats'
import OverdueReport from '../features/report/components/OverdueReport'
import PopularReport from '../features/report/components/PopularReport'

export default function ReportPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom mb={4}>
        Library Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReportStats />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PopularReport />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <OverdueReport />
        </Grid>
      </Grid>
    </Box>
  )
}