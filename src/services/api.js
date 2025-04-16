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
    if (token && !config.url.includes('/api/authentication/')) {
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

    storageToken(response);

    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post(
      '/api/authentication/authenticate',
      credentials
    );

    storageToken(response);

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

function storageToken(response) {
  const { token } = response.data;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    throw new Error('Token not received');
  }
}

export const logout = async () => {
  try {
    const response = await api.post('/api/authentication/logout');
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/api/category');

    return response.data;
  } catch (error) {
    console.error('Error loading categories');
    throw error;
  }
};

export const getByIdCategory = async (id) => {
  try {
    const response = await api.get(`/api/category/${id}`);

    return response.data;
  } catch (error) {
    console.log('Error loading category with id: ', id);
    throw error;
  }
};

export const postCategory = async (data) => {
  try {
    const response = await api.post('/api/category', data);

    return response.data;
  } catch (error) {
    console.error('Category registration failed:', error);
    throw error;
  }
};

export const putCategory = async (data, id) => {
  try {
    const response = await api.put(`/api/category/${id}`, data);

    return response.data;
  } catch (error) {
    console.error('Error editing category with id: ', id);
    throw error;
  }
};

export const getByIdTask = async (id) => {
  try {
    const response = await api.get(`/api/task/${id}`);

    return response.data;
  } catch (error) {
    console.log('Error loading task with id: ', id);
    throw error;
  }
};

export const postTask = async (data) => {
  try {
    const response = await api.post('/api/task', data);

    return response.data;
  } catch (error) {
    console.error('Task registration failed:', error);
    throw error;
  }
};

export const putTask = async (data, id) => {
  try {
    const response = await api.put(`/api/task/${id}`, data);

    return response.data;
  } catch (error) {
    console.error('Error editing task with id: ', id);
    throw error;
  }
};

export const putTaskByCategoryId = async (id, categoryId) => {
  try {
    const response = await api.put(`/api/task/${id}/${categoryId}`);

    return response.data;
  } catch (error) {
    console.error('Error editing category of the task with id: ', id);
    throw error;
  }
};
