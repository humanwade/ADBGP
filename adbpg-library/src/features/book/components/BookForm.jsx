import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Paper, Typography } from '@mui/material'

export default function BookForm({ initialValues, onSubmit, onCancel, title }) {
  const defaultValues = { title: '', author: '', genre: '', isbn: '', year: '', copies: 1, publisher_id: '' }
  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues)
    }
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
            label="Title" 
            value={form.title || ''} 
            onChange={e => handleChange('title', e.target.value)} 
          />
          <TextField 
            label="Author" 
            value={form.author || ''} 
            onChange={e => handleChange('author', e.target.value)} 
          />
          
          <TextField 
            label="Genre" 
            value={form.genre || ''} 
            onChange={e => handleChange('genre', e.target.value)} 
          />

          <TextField 
            label="ISBN" 
            value={form.isbn || ''} 
            onChange={e => handleChange('isbn', e.target.value)} 
          />
          <TextField 
            label="Publisher ID" 
            value={form.publisher_id || ''} 
            onChange={e => handleChange('publisher_id', e.target.value)} 
          />
          <TextField 
            label="Year" 
            type="number" 
            value={form.year || ''} 
            onChange={e => handleChange('year', e.target.value)} 
          />
          <TextField 
            label="Copies" 
            type="number" 
            value={form.copies || ''} 
            onChange={e => handleChange('copies', Number(e.target.value))} 
          />
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => onSubmit(form)}>
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}