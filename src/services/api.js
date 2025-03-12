import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (credentials, router) => {
  try {
    const response = await api.post(
      '/api/authentication/register',
      credentials
    );
    return response.data;
  } catch (error) {
    console.error('Error saving user: ', error);
    throw error;
  }
};

// export const loginUser = async (credentials) => {
//   try {
//     const response = await api.post('/auth/login', credentials);
//     return response.data;
//   } catch (error) {
//     console.error('Erro ao fazer login', error);
//     throw error;
//   }
// };
// // Função para obter as tarefas (Kanban)
// export const fetchTasks = async () => {
//   try {
//     const response = await api.get('/kanban/tasks'); // Exemplo de endpoint para tarefas
//     return response.data;
//   } catch (error) {
//     console.error('Erro ao buscar tarefas', error);
//     throw error;
//   }
// };

// // Função para criar uma nova tarefa
// export const createTask = async (taskData) => {
//   try {
//     const response = await api.post('/kanban/tasks', taskData); // Exemplo de endpoint para criação de tarefa
//     return response.data;
//   } catch (error) {
//     console.error('Erro ao criar tarefa', error);
//     throw error;
//   }
// };
