// client/settings/api-settings.js
import axios from 'axios'
export const getSettings = () => axios.get('/api/settings').then(r=>r.data)
export const saveSettings = (payload) => axios.post('/api/settings', payload).then(r=>r.data)
