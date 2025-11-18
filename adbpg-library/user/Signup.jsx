// client/user/Signup.jsx
import React, { useState } from 'react'
import { Box, TextField, Button, Paper, Typography } from '@mui/material'
import { signup } from './api-user'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [form, setForm] = useState({name:'',email:'',password:''})
  const nav = useNavigate()

  function submit(){
    signup(form).then(()=>nav('/login')).catch(()=>alert('Signup failed'))
  }

  return (
    <Box sx={{p:3, maxWidth:480}}>
      <Paper sx={{p:3}}>
        <Typography variant="h5" mb={2}>Sign Up</Typography>
        <TextField fullWidth label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} sx={{mb:2}} />
        <TextField fullWidth label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} sx={{mb:2}} />
        <TextField fullWidth label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} sx={{mb:2}} />
        <Box sx={{display:'flex', gap:1}}>
          <Button variant="contained" onClick={submit}>Sign Up</Button>
        </Box>
      </Paper>
    </Box>
  )
}
