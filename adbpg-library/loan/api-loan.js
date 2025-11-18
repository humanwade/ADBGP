// client/loan/api-loan.js
import axios from 'axios'
export const listLoans = () => axios.get('/api/loans').then(r=>r.data)
export const createLoan = (p) => axios.post('/api/loans', p).then(r=>r.data)
export const returnLoan = (id) => axios.post(`/api/loans/${id}/return`).then(r=>r.data)
export const listOverdue = () => axios.get('/api/loans/overdue').then(r=>r.data)
