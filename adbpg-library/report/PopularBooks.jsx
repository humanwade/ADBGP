// client/report/PopularBooks.jsx
import React, {useEffect, useState} from 'react'
import { Box, Paper, Typography, List, ListItem, ListItemText } from '@mui/material'
import { popular } from './api-report'

export default function PopularBooks(){
  const [list, setList] = useState([])

  useEffect(()=>{ popular().then(setList).catch(()=>setList([])) },[])

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Popular Books</Typography>
      <Paper sx={{p:2}}>
        <List>
          {list.map((p,i)=> <ListItem key={p.bookId}><ListItemText primary={`${i+1}. ${p.title}`} secondary={`${p.count} borrows`} /></ListItem>)}
          {list.length === 0 && <Typography>No data</Typography>}
        </List>
      </Paper>
    </Box>
  )
}
