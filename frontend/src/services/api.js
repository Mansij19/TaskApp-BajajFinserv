import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/bfhl/tasks'
});

export const getTasks = async (status, minImportance) => {
  const params = {};
  if (status && status !== 'all') params.status = status;
  if (minImportance) params.minImportance = minImportance;
  
  const response = await api.get('/', { params });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.patch(`/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
