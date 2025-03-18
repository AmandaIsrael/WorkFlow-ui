<template>
  <div class="kanban">
    <div class="top-bar">
      <img
        src="/profile.png"
        alt="User Icon"
        class="user-icon"
        @click="toggleDropdown"
      />
      <div v-if="isDropdownVisible" class="dropdown-menu">
        <ul>
          <li><button class="button-menu" @click="logout">Logout</button></li>
        </ul>
      </div>
    </div>

    <!-- <div class="categories-container">
      <button @click="addCategory">
        Add Category
      </button>
      <div class="categories">
        <div v-for="category in categories" :key="category.id" class="category">
          <h2 class="category-title">{{ category.name }}</h2>
          <div v-for="task in category.tasks" :key="task.id" class="task">
            {{ task.name }}
          </div>
          <button class="add-task-btn" @click="openAddTask(category.id)">
            Add Task
          </button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="add-task-modal" @click.stop>
        <AddTask :categoryId="selectedCategoryId" @task-added="addTask" />
      </div>
    </div> -->
  </div>
</template>

<script>
import AddTask from './Modal/AddTask.vue';

export default {
  components: {
    AddTask,
  },
  data() {
    return {
      categories: [],
      isModalOpen: false,
      selectedCategoryId: null,
      isDropdownVisible: false,
    };
  },
  methods: {
    async fetchCategories() {
      // Simula chamada à API
      // this.categories = await this.getCategoriesFromAPI();
    },
    addCategory() {
      // Adiciona categoria via API
    },
    openAddTask(categoryId) {
      this.selectedCategoryId = categoryId;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    logout() {
      // Lógica de logout
      console.log('Usuário deslogado!');
      this.isDropdownVisible = false; // Fechar o dropdown após clicar em sair
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
.kanban {
  padding: 20px;
  background-color: #242424;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.top-bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  position: relative;
}

.user-icon {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); 
  padding: 10px;
  width: 150px;
  z-index: 10;
  display: flex;
  flex-direction: column;
}


ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 5px 0;
}

.button-menu {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-radius: 4px;
}

.button-menu:hover {
  color: #646cff;
}

.categories-container {
  overflow-x: auto;
  width: 100%;
  padding: 10px;
}

.categories {
  display: flex;
  gap: 20px;
}

.category {
  min-width: 300px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.task {
  background-color: white;
  color: black;
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  border-left: 4px solid #646cff;
}
</style>
