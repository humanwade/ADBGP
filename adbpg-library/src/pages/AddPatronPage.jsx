import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createPatron } from '../features/patron/api/patronApi'
import PatronForm from '../features/patron/components/PatronForm'

export default function AddPatronPage() {
  const nav = useNavigate()

  const handleSubmit = (form) => {
    createPatron(form)
      .then(() => nav('/patrons'))
      .catch(() => alert('Error creating patron'))
  }

  return (
    <PatronForm 
      title="Add New Patron" 
      onSubmit={handleSubmit} 
      onCancel={() => nav('/patrons')} 
    />
  )
}