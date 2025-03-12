<template>
  <div class="kanban">
    <div class="columns">
      <div class="column">
        <h2 class="column-title to-do">To-do</h2>
        <div v-for="task in todoTasks" :key="task.id" class="task">
          {{ task.name }}
        </div>
        <button class="add-task-btn" @click="openAddTask('todo')">Add Task</button>
      </div>

      <div class="column">
        <h2 class="column-title doing">Doing</h2>
        <div v-for="task in doingTasks" :key="task.id" class="task">
          {{ task.name }}
        </div>
        <button class="add-task-btn" @click="openAddTask('doing')">Add Task</button>
      </div>

      <div class="column">
        <h2 class="column-title complete">Complete</h2>
        <div v-for="task in completeTasks" :key="task.id" class="task">
          {{ task.name }}
        </div>
        <button class="add-task-btn" @click="openAddTask('complete')">Add Task</button>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="add-task-modal" @click.stop>
        <AddTask :column="column" @task-added="addTask" />
      </div>
    </div>
  </div>
</template>

<script>
import AddTask from './AddTask.vue';

export default {
  components: {
    AddTask,
  },
  data() {
    return {
      todoTasks: [],
      doingTasks: [],
      completeTasks: [],
      isModalOpen: false,
      column: '',
    };
  },
  methods: {
    openAddTask(status) {
      this.column = status;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    addTask(task) {
      if (task) {
        this.$store.dispatch('addTask', { status: this.column, task });
        this.isModalOpen = false;
      }
    },
  },
};
</script>

<style scoped>
.kanban {
  padding: 20px;
  background-color: #242424;
  color: black;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.columns {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  border-radius: 10px;
}

.column {
  width: 30%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-height: 400px;
  box-sizing: border-box;
  padding-bottom: 50px;
}

.column-title {
  font-size: 24px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
}

.to-do {
  background-color: #ffb74d;
}

.doing {
  background-color: #ffeb3b;
}

.complete {
  background-color: #81c784;
}

.task {
  background-color: white;
  color: black;
  padding: 12px;
  margin: 10px;
  border-radius: 6px;
  font-size: 16px;
  border-left: 8px solid #646cff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.add-task-btn {
  background-color: #646cff;
  color: white;
  padding: 12px;
  margin-top: 20px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 90%;
  max-width: 150px;
  margin-left: auto;
  margin-right: auto;
}

.add-task-btn:hover {
  background-color: #535bf2;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-task-modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
  position: relative;
}

@media (max-width: 768px) {
  .columns {
    flex-direction: column;
    align-items: center;
  }

  .column {
    width: 90%;
    margin-bottom: 20px;
  }
}
</style>
