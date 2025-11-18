// client/user/api-user.js
import axios from 'axios'
export const listUsers = () => axios.get('/api/users').then(r=>r.data)
export const createUser = (u) => axios.post('/api/users', u).then(r=>r.data)
export const updateUser = (id,u) => axios.put(`/api/users/${id}`, u).then(r=>r.data)
export const deleteUser = (id) => axios.delete(`/api/users/${id}`).then(r=>r.data)
export const login = (credentials) => axios.post('/api/auth/login', credentials).then(r=>r.data)
export const signup = (payload) => axios.post('/api/auth/signup', payload).then(r=>r.data)
export const getProfile = () => axios.get('/api/auth/profile').then(r=>r.data)
export const updateProfile = (p) => axios.put('/api/auth/profile', p).then(r=>r.data)
