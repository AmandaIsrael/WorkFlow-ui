import { createRouter, createWebHistory } from 'vue-router';
import Kanban from '../views/Kanban.vue';
import AddTask from '../views/AddTask.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/kanban',
    name: 'kanban',
    component: Kanban,
  },
  {
    path: '/add-task/:column',
    name: 'add-task',
    component: AddTask,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
