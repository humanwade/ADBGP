// client/book/SearchBook.jsx
import React, { useState } from 'react'
import { Box, TextField, Paper, List, ListItem, ListItemText, Typography } from '@mui/material'
import { searchBooks } from '../features/book/api/bookApi'

export default function SearchBook(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])

  function doSearch(){
    if(!q.trim()) return setResults([])
    searchBooks(q).then(setResults).catch(()=>setResults([]))
  }

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Search Books</Typography>
      <Box sx={{display:'flex', gap:1, mb:2}}>
        <TextField size="small" value={q} onChange={e=>setQ(e.target.value)} placeholder="Title, author, ISBN..." sx={{flex:1}} />
        <button className="btn" onClick={doSearch}>Search</button>
      </Box>

      <Paper>
        <List>
          {results.map(r => (
            <ListItem key={r._id || r.id}>
              <ListItemText primary={r.title} secondary={`${r.author} — ${r.genre}`} />
            </ListItem>
          ))}
          {results.length === 0 && <ListItem><ListItemText primary="No results" /></ListItem>}
        </List>
      </Paper>
    </Box>
  )
}
