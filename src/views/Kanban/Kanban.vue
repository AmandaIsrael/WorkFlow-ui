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
      <div class="header">
        <div class="search-wrapper">
          <i class="fa fa-search search-icon"></i>
          <input
            type="text"
            v-model="search"
            placeholder="Search category's name"
            @input="filteredCategories"
            class="search-input"
          />
        </div>
        <input type="date" v-model="deadline" class="date-input" />
        <div class="submit-category">
          <button @click="openSubmitCategory">Add Category</button>
        </div>
      </div>
      <div class="categories">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category"
          :style="{ '--category-color': category.color }"
          @drop="handleDrop($event, category)"
          @dragover="handleDragOver($event)"
        >
          <div
            class="category-head"
            :style="{
              '--category-color': category.color,
              color: getTextColor(category.color),
            }"
            @click="openEditCategory(category.id)"
          >
            <i :class="category.icon" class="category-icon"></i>
            <h2>{{ category.name }}</h2>
          </div>
          <div class="task-list">
            <div
              v-for="task in category.taskList"
              :key="task.id"
              class="task-head"
              draggable="true"
              @dragstart="handleDragStart($event, task, category)"
            >
              <i
                class="fa-solid fa-grip-vertical drag-icon"
                title="Drag to move"
              ></i>
              <div class="task" @click="openEditTask(category.id, task.id)">
                <div class="task-title">
                  {{ task.title }}
                </div>
                <div class="task-subject">
                  {{ status[task.status] }}
                  <div class="task-subject-icon">
                    <i
                      v-if="task.priority === 2"
                      class="fa-solid fa-fire"
                      title="priority"
                    ></i>
                    <i
                      v-if="new Date(task.deadline) < new Date()"
                      class="fa-solid fa-clock"
                      title="deadline"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="submit-task"
            :style="{ '--category-color': category.color }"
          >
            <button @click="openSubmitTask(category.id)">Add Task</button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isCategoryModalOpen"
      class="modal-overlay"
      @click="closeCategoryModal"
    >
      <div class="add-modal" @click.stop>
        <SubmitCategory
          ref="SubmitCategory"
          :isEdit="selectedCategoryId != null"
          :categoryId="selectedCategoryId"
          @reloadKanban="handleCategoryUpdate"
        />
      </div>
    </div>

    <div v-if="isTaskModalOpen" class="modal-overlay" @click="closeTaskModal">
      <div class="add-modal" @click.stop>
        <SubmitTask
          ref="SubmitTask"
          :isEdit="selectedTaskId != null"
          :taskId="selectedTaskId"
          :categoryId="selectedCategoryId"
          @reloadKanban="handleTaskUpdate"
        />
      </div>
    </div>

    <Popup ref="popup" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import SubmitTask from './Modal/SubmitTask.vue';
import messages from '../../utils/messages';
import Popup from '../../components/Popup.vue';
import SubmitCategory from './Modal/SubmitCategory.vue';
import {
  putTaskByCategoryId,
  getCategories,
  logout,
} from '../../services/api.js';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

export default {
  components: {
    SubmitCategory,
    SubmitTask,
    LoadingSpinner,
    Popup,
  },
  data() {
    return {
      categories: [],
      isCategoryModalOpen: false,
      isTaskModalOpen: false,
      selectedCategoryId: null,
      selectedTaskId: null,
      isDropdownVisible: false,
      loading: false,
      router: useRouter(),
      isEditCategory: false,
      status: [
        'Pending',
        'In progress',
        'Completed',
        'Blocked',
        'Canceled',
        'Late',
      ],
      search: '',
      deadline: new Date().toISOString().split('T')[0],
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
          : this.triggerPopup(messages.categoriesError);
      } finally {
        this.loading = false;
      }
    },
    openSubmitCategory() {
      this.isCategoryModalOpen = true;
    },
    openEditCategory(categoryId) {
      this.selectedCategoryId = categoryId;
      this.isEditCategory = true;
      this.isCategoryModalOpen = true;
    },
    openSubmitTask(categoryId) {
      this.selectedCategoryId = categoryId;
      this.isTaskModalOpen = true;
    },
    openEditTask(categoryId, taskId) {
      this.selectedCategoryId = categoryId;
      this.selectedTaskId = taskId;
      this.isTaskModalOpen = true;
    },
    closeCategoryModal() {
      this.isCategoryModalOpen = false;
      this.selectedCategoryId = null;
    },
    closeTaskModal() {
      this.isTaskModalOpen = false;
      this.selectedCategoryId = null;
      this.selectedTaskId = null;
    },
    handleCategoryUpdate() {
      this.closeCategoryModal();
      this.fetchCategoriesWithTasks();
    },
    handleTaskUpdate() {
      this.closeTaskModal();
      this.fetchCategoriesWithTasks();
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    async logout() {
      this.loading = true;
      try {
        const response = await logout();
        if (response) {
          console.log(response);
        }
      } catch (error) {
        error.response
          ? this.router.push('/error')
          : this.triggerPopup(messages.logoutError);
      } finally {
        this.loading = false;
        this.isDropdownVisible = false;
      }
    },
    triggerPopup(message) {
      this.$refs.popup.showPopup(message);
    },
    handleDragStart(event, task) {
      if (task?.id) {
        event.dataTransfer.setData('taskId', task.id);
      }
    },
    handleDragOver(event) {
      event.preventDefault();
    },
    handleDrop(event, targetCategory) {
      if (targetCategory !== undefined) {
        const taskId = event.dataTransfer.getData('taskId');
        this.updateTaskCategory(taskId, targetCategory.id);
      }
    },
    async updateTaskCategory(taskId, categoryId) {
      this.loading = true;
      try {
        const response = await putTaskByCategoryId(taskId, categoryId);
        if (response) {
          this.triggerPopup(messages.taskUpdate);
        }
      } catch {
        this.triggerPopup(messages.taskUpdateError);
      } finally {
        this.loading = false;
        this.fetchCategoriesWithTasks();
      }
    },
    filteredCategories() {},
    getTextColor(hexColor) {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance > 186 ? 'black' : 'white';
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
  height: 100dvh;
  min-height: 100vh;
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
  margin-bottom: 20px;
}

.user-icon {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 80px;
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

.header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.search-wrapper {
  flex: 3;
  display: flex;
  align-items: center;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: #888;
}

.search-input {
  padding: 8px 8px 8px 30px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
}

.date-input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.submit-category {
  flex: 1;
}

.submit-category button {
  padding: 8px 16px;
  font-size: 14px;
  margin: 0;
}

.categories-container {
  flex-grow: 1;
  width: 100%;
  overflow-x: auto;
  padding: 20px;
  justify-content: center;
}

.categories {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.category {
  min-width: 300px;
  background-color: var(--category-color);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 500px;
}

.category-head {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 15px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: var(--category-color);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
}

.category-head:hover {
  cursor: pointer;
  transition: 0.3s ease;
  background-color: #c4c6ff;
}

.category-icon {
  font-size: 25px;
  margin-right: 15px;
}

.task-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.task-head {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 10px 0;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.drag-icon {
  cursor: grab;
  color: #888;
  padding: 10px;
  flex-shrink: 0;
}

.task {
  flex-grow: 1;
  padding: 10px;
  background-color: white;
  color: black;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
}

.task-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

.task-subject {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}

.task-subject-icon {
  display: flex;
  gap: 8px;
  color: red;
}

.task:hover {
  background-color: #c4c6ff;
  cursor: pointer;
}

.submit-task {
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding: 15px;
  border-radius: 5px;
  background-color: var(--category-color);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
}

.submit-task button {
  margin: 0;
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

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .submit-category {
    width: 100%;
    margin-top: 10px;
  }

  .categories {
    flex-direction: column;
  }

  .category {
    min-width: 100%;
  }
}
</style>
