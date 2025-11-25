// src/features/patron/components/PatronSearch.jsx
import React, { useState } from 'react'
import { Box, TextField, Paper, List, ListItem, ListItemText, Typography, Button } from '@mui/material'
import { searchPatrons } from '../api/patronApi'

export default function PatronSearch() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])

  function doSearch() {
    if (!q.trim()) {
      setResults([])
      return
    }
    searchPatrons(q)
      .then(data => setResults(data))
      .catch(() => setResults([]))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      doSearch()
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Search Patrons</Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField 
          size="small" 
          value={q} 
          onChange={e => setQ(e.target.value)} 
          onKeyDown={handleKeyDown} 
          placeholder="Name, membership..." 
          sx={{ flex: 1 }} 
        />
        <Button variant="contained" onClick={doSearch}>
          Search
        </Button>
      </Box>

      <Paper>
        <List>
          {results.map(r => (
            <ListItem key={r._id || r.id}>
              <ListItemText 
                primary={r.name} 
                secondary={`${r.membership} — ${r.phone}`} 
              />
            </ListItem>
          ))}
          
          {results.length === 0 && q.trim() !== '' && (
            <ListItem>
              <ListItemText primary="No results found" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  )
}