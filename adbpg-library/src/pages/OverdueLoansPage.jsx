// client/loan/OverdueLoans.jsx
import React, {useEffect, useState} from 'react'
import { Box, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material'
import { listOverdue, returnLoan } from '../features/loan/api/loanApi'

export default function OverdueLoans(){
  const [items,setItems] = useState([])

  useEffect(()=>{ listOverdue().then(setItems).catch(()=>setItems([])) },[])

  function onReturn(id){ if(!confirm('Mark returned?')) return; returnLoan(id).then(()=> setItems(items.filter(i=> (i._id||i.id) !== id))).catch(()=>alert('Error')) }

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Overdue Loans</Typography>
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Book</TableCell><TableCell>Patron</TableCell><TableCell>Due Date</TableCell><TableCell>Fine</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {items.map(i=>(
              <TableRow key={i._id || i.id}>
                <TableCell>{i.bookTitle}</TableCell>
                <TableCell>{i.patronName}</TableCell>
                <TableCell>{i.dueDate}</TableCell>
                <TableCell>{i.fine}</TableCell>
                <TableCell><Button size="small" onClick={()=>onReturn(i._id || i.id)}>Mark as Returned</Button></TableCell>
              </TableRow>
            ))}
            {items.length === 0 && <TableRow><TableCell colSpan={5} align="center">No overdue loans</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
