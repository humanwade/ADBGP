import React, {useEffect, useState} from 'react'
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from '@mui/material'
import { listUsers, deleteUser } from './api-users'

export default function Users(){
  const [users,setUsers]=useState([])
  useEffect(()=>listUsers().then(setUsers).catch(()=>setUsers([])),[])
  return (
    <Box sx={{p:3}}>
      <Typography variant="h5">System Users</Typography>
      <Paper sx={{mt:2}}>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {users.map(u=>(
              <TableRow key={u._id || u.id}>
                <TableCell>{u.name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell>
                <TableCell><Button size="small" color="error" onClick={()=>deleteUser(u._id||u.id).then(()=>location.reload())}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
