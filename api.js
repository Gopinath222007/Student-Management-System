import axios from 'axios';

// Base URL of the Django REST Framework backend.
// Override with REACT_APP_API_URL in a .env file for other environments.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const StudentAPI = {
  list: (params = {}) => api.get('/students/', { params }),
  get: (id) => api.get(`/students/${id}/`),
  create: (data) => api.post('/students/', data),
  update: (id, data) => api.patch(`/students/${id}/`, data),
  remove: (id) => api.delete(`/students/${id}/`),
};

export default api;
