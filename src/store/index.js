import { createStore } from 'vuex';

export default createStore({
  state: {
    todoTasks: [],
    doingTasks: [],
    completeTasks: [],
  },
  mutations: {
    submitTask(state, { status, task }) {
      state[`${status}Tasks`].push(task);
    },
  },
  actions: {
    submitTask({ commit }, { status, task }) {
      commit('submitTask', { status, task });
    },
  },
});
