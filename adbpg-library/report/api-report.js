// client/report/api-report.js
import axios from 'axios'
export const stats = () => axios.get('/api/reports/stats').then(r=>r.data)
export const overdue = () => axios.get('/api/reports/overdue').then(r=>r.data)
export const popular = () => axios.get('/api/reports/popular').then(r=>r.data)
