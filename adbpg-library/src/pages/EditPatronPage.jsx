import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatron, updatePatron } from '../features/patron/api/patronApi'
import PatronForm from '../features/patron/components/PatronForm'

export default function EditPatronPage() {
  const [patron, setPatron] = useState(null)
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) getPatron(id).then(setPatron).catch(() => {})
  }, [id])

  const handleSubmit = (form) => {
    updatePatron(id, form)
      .then(() => nav('/patrons'))
      .catch(() => alert('Error updating patron'))
  }

  if (!patron) return <div>Loading...</div>

  return (
    <PatronForm 
      title="Edit Patron" 
      initialValues={patron}
      onSubmit={handleSubmit} 
      onCancel={() => nav('/patrons')} 
    />
  )
}