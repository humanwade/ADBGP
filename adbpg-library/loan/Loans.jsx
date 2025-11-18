import React, { useEffect, useState } from 'react'
import {
  Box, Button, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Loans() {
  const [loans, setLoans] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    setLoans([
      { id: 1, book: "Book A", patron: "John Doe", due: "2025-01-20" },
      { id: 2, book: "Book B", patron: "Jane Smith", due: "2025-01-25" }
    ])
  }

  function onDelete(id) {
    if (!confirm("Delete loan?")) return
    setLoans(prev => prev.filter(l => l.id !== id))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Loans</Typography>
        <Button variant="contained" onClick={() => nav('/loans/add')}>
          Add Loan
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Patron</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loans.map(l => (
              <TableRow key={l.id}>
                <TableCell>{l.book}</TableCell>
                <TableCell>{l.patron}</TableCell>
                <TableCell>{l.due}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => nav(`/loans/edit/${l.id}`)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => onDelete(l.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No loans</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
