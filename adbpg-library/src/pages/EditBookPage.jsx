import React, { useEffect, useState } from 'react'
import { getBook, updateBook, getPublishers } from '../features/book/api/bookApi'
import BookForm from '../features/book/components/BookForm' 
import { useNavigate, useParams } from 'react-router-dom'

export default function EditBookPage() {
  const [book, setBook] = useState(null)
  const [publishers, setPublishers] = useState([]) 
  
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      getBook(id)
        .then(data => setBook(data))
        .catch(() => alert('Could not load book'))
    }

    getPublishers()
      .then(data => setPublishers(data))
      .catch(err => console.error("Failed to load publishers", err))

  }, [id])

  const handleUpdate = (formData) => {
    updateBook(id, formData)
      .then(() => nav('/books'))
      .catch(() => alert('Error saving book'))
  }

  if (!book) return <div>Loading...</div>

  return (
    <BookForm 
      title="Edit Book"
      initialValues={book} 
      publisherOptions={publishers} 
      onSubmit={handleUpdate} 
      onCancel={() => nav('/books')} 
    />
  )
}