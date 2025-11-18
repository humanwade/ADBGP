import React, { useEffect, useState } from 'react'
import {
  Box, Button, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Patrons() {
  const [patrons, setPatrons] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    setPatrons([
      { id: 1, name: "John Doe", membership: "Standard", phone: "555-1111" },
      { id: 2, name: "Jane Smith", membership: "Premium", phone: "555-2222" }
    ])
  }

  function onDelete(id) {
    if (!confirm("Delete patron?")) return
    setPatrons(prev => prev.filter(p => p.id !== id))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Patrons</Typography>
        <Button variant="contained" onClick={() => nav('/patrons/add')}>
          Add Patron
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Membership</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patrons.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.membership}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => nav(`/patrons/edit/${p.id}`)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => onDelete(p.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {patrons.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No patrons</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
