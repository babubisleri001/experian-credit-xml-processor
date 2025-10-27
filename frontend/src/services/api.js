import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Example React Query fetcher
export const fetchOverview = async () => {
  const response = await axios.get(`${VITE_API_URL}/reports/stats/overview`);
  return response.data; // now includes { stats, insight }
};


export const uploadReport = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/reports/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const getAllReports = async () => {
  const response = await api.get('/reports');
  return response.data.data;
};

export const getReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data.data;
};

export const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

export default api;
