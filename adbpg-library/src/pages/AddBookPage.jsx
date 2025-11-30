import React, { useEffect, useState } from 'react'
import { createBook, getPublishers } from '../features/book/api/bookApi'
import BookForm from '../features/book/components/BookForm' 
import { useNavigate } from 'react-router-dom'

export default function AddBookPage() {
  const nav = useNavigate()
  const [publishers, setPublishers] = useState([]) 

  useEffect(() => {
    getPublishers()
      .then(data => setPublishers(data))
      .catch(err => console.error("Failed to load publishers", err))
  }, [])

  const handleCreate = (formData) => {
    createBook(formData)
      .then(() => nav('/books'))
      .catch(e => alert('Error creating book'))
  }

  return (
    <BookForm 
      title="Add New Book"
      publisherOptions={publishers}
      onSubmit={handleCreate} 
      onCancel={() => nav('/books')} 
    />
  )
}