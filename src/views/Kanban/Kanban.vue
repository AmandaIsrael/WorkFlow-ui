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

    <div class="categories-container">
      <LoadingSpinner :loading="loading" />
      <div class="categories">
        <div
          v-for="category in categories"
          :key="category.id"
          :style="{ backgroundColor: category.color }"
          class="category"
        >
          <div class="category-head">
            <i :class="category.icon" class="category-icon"></i>
            <h2>{{ category.name }}</h2>
          </div>
          <div v-for="task in category.tasks" :key="task.id" class="task">
            {{ task.name }}
          </div>
          <button class="add-task" @click="openAddTask(category.id)">
            Add Task
          </button>
        </div>
      </div>
    </div>
    <div class="add-category">
      <button @click="openAddCategory">Add Category</button>
    </div>

    <div
      v-if="isCategoryModalOpen"
      class="modal-overlay"
      @click="closeCategoryModal"
    >
      <div class="add-modal" @click.stop>
        <AddCategory ref="AddCategory" @reloadKanban="reloadKanban" />
      </div>
    </div>

    <div v-if="isTaskModalOpen" class="modal-overlay" @click="closeTaskModal">
      <div class="add-modal" @click.stop>
        <AddTask ref="AddTask" @reloadKanban="reloadKanban" />
      </div>
    </div>

    <Popup ref="popup" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import AddTask from './Modal/AddTask.vue';
import messages from '../../utils/messages';
import Popup from '../../components/Popup.vue';
import AddCategory from './Modal/AddCategory.vue';
import { getCategories } from '../../services/api.js';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

export default {
  components: {
    AddCategory,
    AddTask,
    LoadingSpinner,
    Popup,
  },
  data() {
    return {
      categories: [],
      isCategoryModalOpen: false,
      isTaskModalOpen: false,
      selectedCategoryId: null,
      isDropdownVisible: false,
      loading: false,
      router: useRouter(),
    };
  },
  methods: {
    async fetchCategoriesWithTasks() {
      this.loading = true;
      try {
        this.categories = await getCategories();
      } catch (error) {
        error.response?.status === 403
          ? this.router.push('/error')
          : triggerPopup(messages.categoriesError);
      } finally {
        this.loading = false;
      }
    },

    openAddCategory() {
      this.isCategoryModalOpen = true;
    },
    openAddTask(categoryId) {
      this.selectedCategoryId = categoryId;
      this.isTaskModalOpen = true;
    },
    closeCategoryModal() {
      this.isCategoryModalOpen = false;
    },
    reloadKanban() {
      this.closeCategoryModal();
      this.fetchCategoriesWithTasks();
    },
    closeTaskModal() {
      this.isTaskModalOpen = false;
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    logout() {
      // Lógica de logout
      console.log('Usuário deslogado!');
      this.isDropdownVisible = false;
    },
    triggerPopup(message) {
      this.$refs.popup.showPopup(message);
    },
  },
  mounted() {
    this.fetchCategoriesWithTasks();
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
  align-items: center;
  padding: 10px;
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.category {
  min-width: 300px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.task {
  background-color: white;
  color: black;
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  border-left: 4px solid #646cff;
}

.add-category button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
}

.add-task {
  margin-top: auto;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
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

.add-modal {
  background-color: #eceaea;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
  position: relative;
}

.category-head {
  color: black;
  background-color: #eceaea;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  padding: 10px;
  display: flex;
  justify-content: center;
}

.category-icon {
  font-size: 25px;
  color: #333;
  margin-right: 15px;
}
</style>
