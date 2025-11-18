// client/patron/SearchPatron.jsx
import React, { useState } from 'react'
import { Box, TextField, Paper, List, ListItem, ListItemText, Typography } from '@mui/material'
import { searchPatrons } from './api-patron'

export default function SearchPatron(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])

  function doSearch(){
    if(!q.trim()) return setResults([])
    searchPatrons(q).then(setResults).catch(()=>setResults([]))
  }

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Search Patrons</Typography>
      <Box sx={{display:'flex', gap:1, mb:2}}>
        <TextField size="small" value={q} onChange={e=>setQ(e.target.value)} placeholder="Name, membership..." sx={{flex:1}} />
        <button className="btn" onClick={doSearch}>Search</button>
      </Box>

      <Paper>
        <List>
          {results.map(r => (
            <ListItem key={r._id || r.id}>
              <ListItemText primary={r.name} secondary={`${r.membership} — ${r.phone}`} />
            </ListItem>
          ))}
          {results.length === 0 && <ListItem><ListItemText primary="No results" /></ListItem>}
        </List>
      </Paper>
    </Box>
  )
}
