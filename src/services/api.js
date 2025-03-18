import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export const register = async (credentials) => {
  try {
    const response = await api.post(
      '/api/authentication/register',
      credentials
    );
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const loginUser = async (credentials, router) => {
  try {
    const response = await api.post(
      '/api/authentication/authenticate',
      credentials
    );
    const { token } = response.data;

    if (token) {
      localStorage.setItem('authToken', token);
      router.push('/kanban');
    } else {
      throw new Error('Token not received');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
