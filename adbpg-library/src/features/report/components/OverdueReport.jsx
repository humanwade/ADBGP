import React, { useEffect, useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { getOverdue } from '../api/reportApi'

export default function OverdueReport() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    getOverdue()
      .then(data => {
        if (Array.isArray(data)) {
          setRows(data)
        } else {
          console.warn("Overdue report data is not an array:", data)
          setRows([])
        }
      })
      .catch(() => setRows([]))
  }, [])

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Overdue Books List</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Book</TableCell>
            <TableCell>Patron</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Fine</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(rows) && rows.map(r => (
            <TableRow key={r._id || r.id}>
              <TableCell>{r.bookTitle}</TableCell>
              <TableCell>{r.patronName}</TableCell>
              <TableCell sx={{ color: 'error.main' }}>{r.dueDate}</TableCell>
              <TableCell>${r.fine}</TableCell>
            </TableRow>
          ))}
          
          {(!Array.isArray(rows) || rows.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} align="center">No overdue books</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}