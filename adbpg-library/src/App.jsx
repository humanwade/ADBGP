import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Menu from "../core/Menu";
import Books from '../book/Books'
import AddBook from '../book/AddBook'
import EditBook from '../book/EditBook'
import Patrons from '../patron/Patrons'
import Loans from '../loan/Loans'
import Reports from '../report/Reports'
import Settings from '../settings/Settings'
import Users from '../user/Users'
import Home from '../core/Home'

export default function App(){
  return (
    <Box sx={{ display:'flex', minHeight:'100vh' }}>
      <Menu />
      <Box component="main" sx={{ flex:1, bgcolor:'#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/edit/:id" element={<EditBook />} />
          <Route path="/patrons" element={<Patrons />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Box>
    </Box>
  )
}