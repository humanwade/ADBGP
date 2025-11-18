// client/patron/EditPatron.jsx
import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Paper, Typography } from '@mui/material'
import { getPatron, updatePatron } from './api-patron'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditPatron(){
  const [form,setForm] = useState(null)
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(()=>{ if(id) getPatron(id).then(p=>setForm(p)).catch(()=>{}) },[id])

  function submit(){
    updatePatron(id, form).then(()=>nav('/patrons')).catch(()=>alert('Error'))
  }

  if(!form) return <div>Loading...</div>

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Edit Patron</Typography>
      <Paper sx={{p:2}}>
        <Box sx={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2}}>
          <TextField label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <TextField label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <TextField label="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
          <TextField label="Membership #" value={form.membership} onChange={e=>setForm({...form,membership:e.target.value})} />
        </Box>
        <Box sx={{mt:2, display:'flex', gap:1}}>
          <Button variant="contained" onClick={submit}>Save</Button>
          <Button variant="outlined" onClick={()=>nav('/patrons')}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  )
}
