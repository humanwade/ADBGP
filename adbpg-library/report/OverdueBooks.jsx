// client/report/OverdueBooks.jsx
import React, {useEffect, useState} from 'react'
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material'
import { overdue } from './api-report'

export default function OverdueBooks(){
  const [rows, setRows] = useState([])

  useEffect(()=>{ overdue().then(setRows).catch(()=>setRows([])) },[])

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Overdue Books</Typography>
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Book</TableCell><TableCell>Patron</TableCell><TableCell>Due</TableCell><TableCell>Fine</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r._id || r.id}>
                <TableCell>{r.bookTitle}</TableCell><TableCell>{r.patronName}</TableCell><TableCell>{r.dueDate}</TableCell><TableCell>{r.fine}</TableCell>
                <TableCell><Button size="small">Mark as Returned</Button></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={5} align="center">No overdue books</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
