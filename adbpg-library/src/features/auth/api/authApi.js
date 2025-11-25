import axios from '../../../utils/axiosClient'

export const login = async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('user_name', response.data.name);
    }
    return response.data;
};

export const signup = async (data) => {

    const nameParts = data.name ? data.name.split(' ') : ['']; 
    const firstName = nameParts[0]; 
    const lastName = nameParts.slice(1).join(' ') || ''; 

    return axios.post('/api/auth/register', {
        firstName: firstName,
        lastName: lastName,
        email: data.email,
        password: data.password
    }).then(r => r.data);
};

export const getProfile = () => {
    const token = localStorage.getItem('token');
    return axios.get('/api/members/me', {
        headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.data);
};

export const updateProfile = (data) => {
    const token = localStorage.getItem('token');
    const nameParts = data.name ? data.name.split(' ') : [''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    return axios.put('/api/members/me', {
        firstName,
        lastName,
        email: data.email
    }, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.data);
};