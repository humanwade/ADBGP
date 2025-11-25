import React, { useEffect, useState } from 'react'
import {
  Box, Button, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { listPatrons, deletePatron } from '../features/patron/api/patronApi'

export default function PatronListPage() {
  const [patrons, setPatrons] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  function loadData() {
    listPatrons()
      .then(data => {
        if (Array.isArray(data)) {
          setPatrons(data)
        } else {
          console.warn("API response is not an array:", data)
          setPatrons([])
        }
      })
      .catch((err) => {
        console.error("Failed to load patrons:", err)
        setPatrons([])
      })
  }

  function onDelete(id) {
    if (!confirm("Delete patron?")) return
    deletePatron(id)
      .then(() => loadData()) 
      .catch(() => alert('Error deleting'))
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Membership</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(patrons) && patrons.map(p => (
              <TableRow key={p._id || p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.address}</TableCell>
                <TableCell>{p.membership}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => nav(`/patrons/edit/${p._id || p.id}`)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => onDelete(p._id || p.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {(!Array.isArray(patrons) || patrons.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center">No patrons found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}