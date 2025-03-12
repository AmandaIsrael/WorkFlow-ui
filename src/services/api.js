// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://api.exemplo.com', // URL do seu back-end
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Função para login
// export const loginUser = async (credentials) => {
//   try {
//     const response = await api.post('/auth/login', credentials); // Exemplo de endpoint de login
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
