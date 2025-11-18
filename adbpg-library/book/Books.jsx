// client/book/Books.jsx
import React, { useEffect, useState } from 'react'
import {
  Box, Button, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Books() {
  const [books, setBooks] = useState([])
  const [q, setQ] = useState("")
  const nav = useNavigate()

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    setBooks([
      { id: 1, title: "Book A", author: "Author X", genre: "Fiction", isbn: "111111", copies: 3 },
      { id: 2, title: "Book B", author: "Author Y", genre: "Drama", isbn: "222222", copies: 5 }
    ])
  }

  const filtered = books.filter(b =>
    `${b.title} ${b.author} ${b.genre} ${b.isbn}`
      .toLowerCase()
      .includes(q.toLowerCase())
  )

  function onDelete(id) {
    if (!confirm("Delete book?")) return
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Books</Typography>
        <Box>
          <TextField size="small" value={q} onChange={e => setQ(e.target.value)} sx={{ mr: 1 }} />
          <Button variant="contained" onClick={() => nav('/books/add')}>Add Book</Button>
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
              <TableCell>Copies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.genre}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>{b.copies}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => nav(`/books/edit/${b.id}`)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => onDelete(b.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No books found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
