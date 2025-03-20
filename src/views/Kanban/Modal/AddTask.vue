<template>
  <div class="add-task-container">
    <h1>Add task</h1>
    <LoadingSpinner :loading="loading" />
    <BaseForm
      :fields="taskFields"
      :columns="taskFields.length"
      :submitHandler="saveTask"
    />
    <Popup ref="popup" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import messages from '../../../utils/messages';
import Popup from '../../../components/Popup.vue';
import { postTask } from '../../../services/api.js';
import BaseForm from '../../../components/BaseForm.vue';
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

const loading = ref(false);
const popup = ref(null);
const router = useRouter();
const emit = defineEmits(['reloadKanban']);

const taskFields = [
  { name: 'title', label: 'Título', type: 'text', required: true },
  { name: 'description', label: 'Descrição', type: 'text', required: true },
  { name: 'priority', label: 'Prioridade', type: 'number', required: true },
  { name: 'status', label: 'Status', type: 'text', required: false },
  { name: 'deadline', label: 'Prazo', type: 'date', required: false },
];

async function saveTask(formData) {
  loading.value = true;

  try {
    const response = await postTask(formData);
    if (response) {
      triggerPopup(messages.taskRegister);
      setTimeout(() => {
        emit('reloadKanban');
      }, 2000);
    }
  } catch (error) {
    error.response?.status === 403
      ? router.push('/error')
      : triggerPopup(messages.taskError);
  } finally {
    loading.value = false;
  }
}

const triggerPopup = (message) => {
  popup.value.showPopup(message);
};
</script>

<style scoped>
.add-task-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
