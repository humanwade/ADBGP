import axios from 'axios'
const BASE_URL = '/api/members'; 

// 1. List
export const listPatrons = () => axios.get(BASE_URL).then(r => {
  return r.data.map(m => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
    email: m.email,
    phone: m.phone || 'N/A',
    address: m.address || '', 
    membership: m.id
  }))
})

// 2. Get Single Patron
export const getPatron = (id) => axios.get(`${BASE_URL}/${id}`).then(r => {
    const m = r.data;
    return {
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        phone: m.phone || '',
        address: m.address || '',
        membership: m.id
    }
})

// 3. Create Patron
export const createPatron = (p) => {
    // Split full name into first and last name for the backend
    const [first, ...last] = p.name.split(' ');
    return axios.post(BASE_URL, {
        firstName: first,
        lastName: last.join(' ') || '',
        email: p.email || `user${Math.floor(Math.random() * 10000)}@test.com`, // Dummy email if empty
        phone: p.phone,
        address: p.address
    }).then(r => r.data)
}

// 4. Update Patron
export const updatePatron = (id, p) => {
    const [first, ...last] = p.name.split(' ');
    return axios.put(`${BASE_URL}/${id}`, {
        firstName: first,
        lastName: last.join(' ') || '',
        email: p.email,
        phone: p.phone,
        address: p.address
    }).then(r => r.data)
}

// 5. Delete Patron
export const deletePatron = (id) => axios.delete(`${BASE_URL}/${id}`).then(r => r.data)

// 6. Search Patrons
export const searchPatrons = (q) => axios.get(`${BASE_URL}/search?q=${encodeURIComponent(q)}`).then(r => {
    // Format search results to match frontend structure
    return r.data.map(m => ({
        id: m.MEMBER_ID || m.id,
        name: `${m.FIRST_NAME || m.firstName} ${m.LAST_NAME || m.lastName}`,
        phone: m.PHONE || 'N/A',
        address: p.address,
        membership: m.MEMBER_ID || m.id
    }))
})