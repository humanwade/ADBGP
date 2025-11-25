import React, { useEffect, useState } from 'react'
import {
  Box, Button, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { listBooks, deleteBook } from '../features/book/api/bookApi'

export default function BookListPage() {
  const [books, setBooks] = useState([])
  const [q, setQ] = useState("")
  const nav = useNavigate()

  const userRole = localStorage.getItem('role'); 
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    listBooks()
      .then(data => {
        if (Array.isArray(data)) {
          setBooks(data)
        } else {
          console.warn("Book data is not an array:", data)
          setBooks([])
        }
      })
      .catch(err => {
        console.error("Failed to fetch books:", err)
        setBooks([])
      })
  }

  function onDelete(id) {
    if (!confirm("Delete this book?")) return
    
    deleteBook(id)
      .then(() => {
        refresh()
      })
      .catch(err => {
        console.error("Delete failed:", err)
        alert("Failed to delete book")
      })
  }

  const filtered = books.filter(b =>
    `${b.title} ${b.author} ${b.genre || ''} ${b.isbn}`
      .toLowerCase()
      .includes(q.toLowerCase())
  )

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Books</Typography>
        <Box>
          <TextField 
            size="small" 
            placeholder="Search..." 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            sx={{ mr: 1 }} 
          />
          
          {isAdmin && (
            <Button variant="contained" onClick={() => nav('/books/add')}>
              Add Book
            </Button>
          )}
        </Box>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Copies</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(filtered) && filtered.map(b => (
              <TableRow key={b.id || b.bookId}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.genre}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>{b.year}</TableCell>
                <TableCell>{b.copies}</TableCell>
                
                {isAdmin && (
                  <TableCell>
                    <Button size="small" onClick={() => nav(`/books/edit/${b.id || b.bookId}`)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => onDelete(b.id || b.bookId)}>Delete</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} align="center">No books found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}