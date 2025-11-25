import axios from '../../../utils/axiosClient'

export const listUsers = () => axios.get('/api/users').then(r=>r.data)
export const createUser = (u) => axios.post('/api/users', u).then(r=>r.data)
export const updateUser = (id,u) => axios.put(`/api/users/${id}`, u).then(r=>r.data)
export const deleteUser = (id) => axios.delete(`/api/users/${id}`).then(r=>r.data)