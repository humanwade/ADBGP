import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material'
import { listUsers, deleteUser } from '../../user/api/userApi'

export default function UserManagement() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    listUsers()
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          console.warn("User data is not an array:", data)
          setUsers([])
        }
      })
      .catch(() => setUsers([]))
  }, [])

  function onDelete(id) {
    if (!confirm('Delete user?')) return
    deleteUser(id)
      .then(() => {
        setUsers(prev => prev.filter(u => (u._id || u.id) !== id))
      })
      .catch(() => alert('Error deleting user'))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>User Management</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.map(u => (
              <TableRow key={u._id || u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => onDelete(u._id || u.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {(!Array.isArray(users) || users.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}