import React, { useState } from 'react'
import { Box, TextField, Button, Paper, Typography, Alert, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { login } from '../features/auth/api/authApi' 

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  const handleSubmit = () => {
    setError('') 
    login(form)
      .then((res) => {
        nav('/') 
      })
      .catch((err) => {
        console.error(err)
        setError('Login failed. Please check your email and password.')
      })
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh',      
      bgcolor: '#f5f5f5'    
    }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold" color="primary">
          Library System
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
        
        <Button fullWidth variant="contained" size="large" onClick={handleSubmit} sx={{ mb: 2 }}>
          Login
        </Button>

        <Box textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => nav('/signup')}
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              underline="hover"
            >
              Sign Up
            </Link>
          </Typography>
        </Box>

      </Paper>
    </Box>
  )
}