import React from 'react'
import { createBook } from '../features/book/api/bookApi'
import BookForm from '../features/book/components/BookForm' 
import { useNavigate } from 'react-router-dom'

export default function AddBookPage() {
  const nav = useNavigate()

  // 저장 로직 (Create)
  const handleCreate = (formData) => {
    createBook(formData)
      .then(() => nav('/books'))
      .catch(e => alert('Error creating book'))
  }

  return (
    <BookForm 
      title="Add New Book"
      onSubmit={handleCreate} 
      onCancel={() => nav('/books')} 
    />
  )
}