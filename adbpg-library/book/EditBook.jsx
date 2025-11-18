// client/book/EditBook.jsx
import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Paper, Typography } from '@mui/material'
import { getBook, updateBook } from './api-book'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditBook(){
  const [form,setForm] = useState(null)
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(()=>{ if(id) getBook(id).then(b=>setForm(b)).catch(()=>{}) },[id])

  function submit(){
    updateBook(id, form).then(()=>nav('/books')).catch(()=>alert('Error saving'))
  }

  if(!form) return <div>Loading...</div>

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Edit Book</Typography>
      <Paper sx={{p:2}}>
        <Box sx={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2}}>
          <TextField label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <TextField label="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} />
          <TextField label="Genre" value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} />
          <TextField label="ISBN" value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} />
          <TextField label="Year" type="number" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} />
          <TextField label="Copies" type="number" value={form.copies} onChange={e=>setForm({...form,copies:Number(e.target.value)})} />
        </Box>
        <Box sx={{mt:2, display:'flex', gap:1}}>
          <Button variant="contained" onClick={submit}>Save</Button>
          <Button variant="outlined" onClick={()=>nav('/books')}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  )
}
