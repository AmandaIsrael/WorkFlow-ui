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

const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
});

const taskFields = [
  { name: 'title', label: 'Título', type: 'text', required: true },
  { name: 'description', label: 'Descrição', type: 'text', required: true },
  {
    name: 'priority',
    label: 'Prioridade',
    type: 'select',
    required: true,
    options: [
      { label: 'Low', value: 0 },
      { label: 'Medium', value: 1 },
      { label: 'High', value: 2 },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: false,
    options: [
      { label: 'Pending', value: 0 },
      { label: 'In progress', value: 1 },
      { label: 'Completed', value: 2 },
      { label: 'Blocked', value: 3 },
      { label: 'Canceled', value: 4 },
      { label: 'Late', value: 5 },
    ],
  },
  { name: 'deadline', label: 'Prazo', type: 'date', required: false },
];

async function saveTask(formData) {
  loading.value = true;

  try {
    formData.category_id = props.categoryId;
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
