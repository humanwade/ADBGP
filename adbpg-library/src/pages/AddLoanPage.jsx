import React, { useState, useEffect } from 'react'
import { Box, Paper, TextField, Button, Typography, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { createLoan } from '../features/loan/api/loanApi'
import { getAvailableBooks } from '../features/book/api/bookApi' 
import { listPatrons } from '../features/patron/api/patronApi' 

export default function AddLoanPage() {
  const [form, setForm] = useState({ copyId: '', memberId: '', dueDate: '' })
  
  const [bookOptions, setBookOptions] = useState([])
  const [patronOptions, setPatronOptions] = useState([])
  
  const nav = useNavigate()

  useEffect(() => {
    getAvailableBooks()
      .then(data => setBookOptions(data))
      .catch(err => console.error("Failed to load books", err))

    listPatrons()
      .then(data => setPatronOptions(data))
      .catch(err => console.error("Failed to load patrons", err))
      
    const today = new Date();
    today.setDate(today.getDate() + 14); 
    setForm(prev => ({ ...prev, dueDate: today.toISOString().split('T')[0] }))
  }, [])

  const handleSubmit = () => {
    if (!form.copyId || !form.memberId) {
      alert('Please select a book and a patron.')
      return
    }
    createLoan(form)
      .then(() => {
        alert('Loan created successfully!')
        nav('/loans')
      })
      .catch((err) => {
        console.error(err)
        alert('Failed to loan book. ' + (err.response?.data?.message || ''))
      })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>New Loan</Typography>
      <Paper sx={{ p: 3, maxWidth: 500 }}>
        
        <TextField 
          select 
          fullWidth 
          label="Select Book" 
          sx={{ mb: 3 }} 
          value={form.copyId} 
          onChange={e => setForm({ ...form, copyId: e.target.value })} 
        >
          {bookOptions.map((b) => (
            <MenuItem key={b.copyId} value={b.copyId}>
              {b.displayTitle}
            </MenuItem>
          ))}
          {bookOptions.length === 0 && <MenuItem disabled>No books available</MenuItem>}
        </TextField>

        <TextField 
          select 
          fullWidth 
          label="Select Patron" 
          sx={{ mb: 3 }} 
          value={form.memberId} 
          onChange={e => setForm({ ...form, memberId: e.target.value })} 
        >
          {patronOptions.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} ({p.email})
            </MenuItem>
          ))}
        </TextField>

        <TextField 
          fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} sx={{ mb: 3 }} 
          value={form.dueDate} 
          onChange={e => setForm({ ...form, dueDate: e.target.value })} 
        />
        
        <Button variant="contained" size="large" onClick={handleSubmit}>
          Create Loan
        </Button>
      </Paper>
    </Box>
  )
}