// client/patron/AddPatron.jsx
import React, { useState } from 'react'
import { Box, Button, TextField, Paper, Typography } from '@mui/material'
import { createPatron } from './api-patron'
import { useNavigate } from 'react-router-dom'

export default function AddPatron(){
  const [form,setForm] = useState({name:'',address:'',phone:'',membership:`M${Math.floor(1000+Math.random()*9000)}`})
  const nav = useNavigate()

  function submit(){
    createPatron(form).then(()=>nav('/patrons')).catch(()=>alert('Error'))
  }

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Add New Patron</Typography>
      <Paper sx={{p:2}}>
        <Box sx={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2}}>
          <TextField label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <TextField label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <TextField label="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
          <TextField label="Membership #" value={form.membership} onChange={e=>setForm({...form,membership:e.target.value})} />
        </Box>
        <Box sx={{mt:2, display:'flex', gap:1}}>
          <Button variant="contained" onClick={submit}>Submit</Button>
          <Button variant="outlined" onClick={()=>nav('/patrons')}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  )
}
