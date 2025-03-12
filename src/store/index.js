import { createStore } from 'vuex';

export default createStore({
  state: {
    todoTasks: [],
    doingTasks: [],
    completeTasks: [],
  },
  mutations: {
    addTask(state, { status, task }) {
      state[`${status}Tasks`].push(task);
    },
  },
  actions: {
    addTask({ commit }, { status, task }) {
      commit('addTask', { status, task });
    },
  },
});
