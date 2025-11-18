// client/user/Login.jsx
import React, { useState } from 'react'
import { Box, TextField, Button, Paper, Typography } from '@mui/material'
import { login } from './api-user'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [form, setForm] = useState({email:'',password:''})
  const nav = useNavigate()

  function submit(){
    login(form).then(res => {
      // token handling left to you (localStorage/session)
      localStorage.setItem('token', res.token)
      nav('/')
    }).catch(()=>alert('Login failed'))
  }

  return (
    <Box sx={{p:3, maxWidth:480}}>
      <Paper sx={{p:3}}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <TextField fullWidth label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} sx={{mb:2}} />
        <TextField fullWidth label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} sx={{mb:2}} />
        <Box sx={{display:'flex', gap:1}}>
          <Button variant="contained" onClick={submit}>Login</Button>
        </Box>
      </Paper>
    </Box>
  )
}
