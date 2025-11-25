import axios from '../../../utils/axiosClient'; 

const BASE_URL = '/api/loans';

// 1. List
export const listLoans = (memberId) => {
    const url = memberId ? `${BASE_URL}?memberId=${memberId}` : BASE_URL;
    return axios.get(url).then(r => r.data);
};

// 2. Add Loan
export const createLoan = (data) => axios.post(BASE_URL, data).then(r => r.data);

// 3. Return
export const returnLoan = (id) => axios.put(`${BASE_URL}/${id}/return`).then(r => r.data);

// 4. OverDue
export const listOverdue = () => axios.get(`${BASE_URL}/overdue`).then(r => r.data);