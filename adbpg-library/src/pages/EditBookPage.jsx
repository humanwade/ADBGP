import React, { useEffect, useState } from 'react'
import { getBook, updateBook } from '../features/book/api/bookApi'
import BookForm from '../features/book/components/BookForm' 
import { useNavigate, useParams } from 'react-router-dom'

export default function EditBookPage() {
  const [book, setBook] = useState(null)
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      getBook(id)
        .then(data => setBook(data))
        .catch(() => alert('Could not load book'))
    }
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
      onSubmit={handleUpdate} 
      onCancel={() => nav('/books')} 
    />
  )
}