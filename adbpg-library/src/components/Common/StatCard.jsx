import React from 'react'
import { Paper, Typography } from '@mui/material'

export default function StatCard({ title, value, subtitle }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>{value}</Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  )
}