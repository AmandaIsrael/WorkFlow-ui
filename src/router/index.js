import { createRouter, createWebHistory } from 'vue-router';
import Kanban from '../views/Kanban/Kanban.vue';
import AddTask from '../views/Kanban/Modal/AddTask.vue';
import Login from '../views/Login/Login.vue';
import Error from '../components/Error.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
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
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPage',
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
