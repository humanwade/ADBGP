// client/book/api-book.js
import axios from '../../../utils/axiosClient'

export const listBooks = () => axios.get('/api/books').then(r => r.data)
export const getBook = (id) => axios.get(`/api/books/${id}`).then(r => r.data)
export const createBook = (payload) => axios.post('/api/books', payload).then(r => r.data)
export const updateBook = (id, payload) => axios.put(`/api/books/${id}`, payload).then(r => r.data)
export const deleteBook = (id) => axios.delete(`/api/books/${id}`).then(r => r.data)
export const searchBooks = (q) => axios.get(`/api/books/search?q=${encodeURIComponent(q)}`).then(r => r.data)
export const getAvailableBooks = () => axios.get('/api/books/available').then(r => r.data);
export const getPublishers = async () => {const response = await axios.get('/api/publishers'); return response.data;};