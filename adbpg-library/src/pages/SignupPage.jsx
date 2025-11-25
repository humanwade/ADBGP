import React, { useState } from 'react'
import { Box, TextField, Button, Paper, Typography, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { signup } from '../features/auth/api/authApi'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }

    signup(form)
      .then(() => {
        alert('Registration successful! Please login.')
        nav('/login')
      })
      .catch((err) => {
        console.error(err)
        setError('Signup failed. Please try again.')
      })
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, p: 2 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Join Library
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField 
          fullWidth label="Full Name" sx={{ mb: 2 }}
          value={form.name} 
          onChange={e => setForm({ ...form, name: e.target.value })} 
        />
        <TextField 
          fullWidth label="Email" sx={{ mb: 2 }}
          value={form.email} 
          onChange={e => setForm({ ...form, email: e.target.value })} 
        />
        <TextField 
          fullWidth label="Password" type="password" sx={{ mb: 3 }}
          value={form.password} 
          onChange={e => setForm({ ...form, password: e.target.value })} 
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        
        <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
          Sign Up
        </Button>
        
        <Button 
          fullWidth sx={{ mt: 1 }} 
          onClick={() => nav('/login')}
        >
          Already have an account? Login
        </Button>
      </Paper>
    </Box>
  )
}