// client/patron/api-patron.js
import axios from 'axios'
export const listPatrons = () => axios.get('/api/patrons').then(r=>r.data)
export const getPatron = (id) => axios.get(`/api/patrons/${id}`).then(r=>r.data)
export const createPatron = (p) => axios.post('/api/patrons', p).then(r=>r.data)
export const updatePatron = (id,p) => axios.put(`/api/patrons/${id}`, p).then(r=>r.data)
export const deletePatron = (id) => axios.delete(`/api/patrons/${id}`).then(r=>r.data)
export const searchPatrons = (q) => axios.get(`/api/patrons/search?q=${encodeURIComponent(q)}`).then(r=>r.data)
