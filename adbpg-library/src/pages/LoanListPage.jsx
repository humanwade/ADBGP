import React, { useEffect, useState } from 'react'
import {
  Box, Button, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, Typography, Chip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { listLoans, returnLoan } from '../features/loan/api/loanApi'

export default function LoanListPage() {
  const [loans, setLoans] = useState([])
  const nav = useNavigate()

  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN';

  const token = localStorage.getItem('token');
  let myId = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      myId = payload.id;
    } catch (e) {
      console.error("Token parsing error:", e);
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    const filterId = isAdmin ? null : myId;

    listLoans(filterId)
      .then(data => {
        if (Array.isArray(data)) setLoans(data)
        else setLoans([])
      })
      .catch(err => console.error(err))
  }

  function handleReturn(id) {
    if (!confirm("Mark this book as returned?")) return;
    returnLoan(id)
      .then(() => {
        alert("Book returned!");
        refresh();
      })
      .catch(err => alert("Failed to return book"));
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">
          {isAdmin ? 'All Loans' : 'My Loans'}
        </Typography>

        {isAdmin && (
          <Button variant="contained" onClick={() => nav('/loans/add')}>
            New Loan
          </Button>
        )}
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book (Copy)</TableCell>
              <TableCell>Patron</TableCell>
              <TableCell>Loan Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {loans.map(l => {
              const isReturned = !!l.returnDate;
              const isOverdue = !isReturned && new Date(l.dueDate) < new Date();

              return (
                <TableRow key={l.id}>
                  <TableCell>{l.bookTitle}</TableCell>
                  <TableCell>{l.patronName}</TableCell>
                  <TableCell>{l.loanDate}</TableCell>
                  <TableCell sx={{ color: isOverdue ? 'error.main' : 'inherit' }}>
                    {l.dueDate}
                  </TableCell>
                  <TableCell>
                    {isReturned ? (
                      <Chip label="Returned" color="success" size="small" variant="outlined" />
                    ) : isOverdue ? (
                      <Chip label="Overdue" color="error" size="small" />
                    ) : (
                      <Chip label="Active" color="primary" size="small" />
                    )}
                  </TableCell>

                  {isAdmin && (
                    <TableCell>
                      {!isReturned && (
                        <Button size="small" variant="contained" color="warning" onClick={() => handleReturn(l.id)}>
                          Return
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} align="center">No loans found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}