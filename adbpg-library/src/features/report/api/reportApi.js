import axios from 'axios';

export const getStats = async () => {
  const response = await axios.get('/api/reports/stats');
  return response.data;
};

export const getPopular = async () => {
  const response = await axios.get('/api/reports/popular');
  return response.data;
};

export const getOverdue = async () => {
  const response = await axios.get('/api/reports/overdue');
  return response.data;
};