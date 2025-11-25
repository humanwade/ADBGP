import axios from '../../../utils/axiosClient'

export const getSettings = () => axios.get('/api/settings').then(r => r.data)
export const saveSettings = (payload) => axios.post('/api/settings', payload).then(r => r.data)