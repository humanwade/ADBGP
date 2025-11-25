import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from '../src/components/Layout/DashboardLayout' 
import ProtectedRoute from '../src/components/Layout/ProtectedRoute'

import LoginPage from '../src/pages/LoginPage'
import SignupPage from '../src/pages/SignupPage'

import HomePage from '../src/pages/HomePage'
import BookListPage from '../src/pages/BookListPage'
import AddBookPage from '../src/pages/AddBookPage'
import EditBookPage from '../src/pages/EditBookPage'
import PatronListPage from '../src/pages/PatronListPage'
import AddPatronPage from '../src/pages/AddPatronPage'
import EditPatronPage from '../src/pages/EditPatronPage'
import LoanListPage from '../src/pages/LoanListPage'
import AddLoanPage from '../src/pages/AddLoanPage'
import ReportPage from '../src/pages/ReportPage'
import SettingsPage from '../src/pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          <Route path="/" element={<HomePage />} />

          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/add" element={<AddBookPage />} />
          <Route path="/books/edit/:id" element={<EditBookPage />} />

          <Route path="/patrons" element={<PatronListPage />} />
          <Route path="/patrons/add" element={<AddPatronPage />} />
          <Route path="/patrons/edit/:id" element={<EditPatronPage />} />

          <Route path="/loans" element={<LoanListPage />} />
          <Route path="/loans/add" element={<AddLoanPage />} />

          <Route path="/reports" element={<ReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  )
}