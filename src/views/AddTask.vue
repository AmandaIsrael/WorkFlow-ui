<template>
  <div class="add-task-container">
    <h2>Add Task to {{ column }}</h2>
    <input v-model="taskName" type="text" placeholder="Enter task name" />
    <button @click="saveTask">Save Task</button>
  </div>
</template>

<script>
export default {
  props: {
    column: String,
  },
  data() {
    return {
      taskName: '',
    };
  },
  methods: {
    saveTask() {
      if (this.taskName) {
        const task = {
          id: Date.now(),
          name: this.taskName,
        };
        this.$emit('task-added', task);
      } else {
        alert('Please enter a task name!');
      }
    },
  },
};
</script>

<style scoped>
.add-task-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-task-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.add-task-container button {
  background-color: #646cff;
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

.add-task-container button:hover {
  background-color: #535bf2;
}
</style>
