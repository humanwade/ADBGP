import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Paper, Typography } from '@mui/material'

export default function PatronForm({ initialValues, onSubmit, onCancel, title }) {
  const defaultValues = {
    name: '',
    email: '',   
    address: '',
    phone: '',
    membership: ''
  }

  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    if (initialValues) setForm(initialValues)
  }, [initialValues])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>{title}</Typography>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Full Name" value={form.name || ''}
            onChange={e => handleChange('name', e.target.value)}
          />

          <TextField
            label="Email" value={form.email || ''}
            onChange={e => handleChange('email', e.target.value)}
          />

          <TextField
            label="Phone" value={form.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
          />
          <TextField
            label="Address" value={form.address || ''}
            onChange={e => handleChange('address', e.target.value)}
          />
          <TextField
            label="Membership #" value={form.membership || 'Auto-Generated'}
            disabled
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => onSubmit(form)}>Save</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  )
}