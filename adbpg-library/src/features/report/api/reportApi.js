// src/features/report/api/reportApi.js
import axios from '../../../utils/axiosClient'
export const getStats = () => axios.get('/api/reports/stats').then(r => r.data)
export const getOverdue = () => axios.get('/api/reports/overdue').then(r => r.data)
export const getPopular = () => axios.get('/api/reports/popular').then(r => r.data)