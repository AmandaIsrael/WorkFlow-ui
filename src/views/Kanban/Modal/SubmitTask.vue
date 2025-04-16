<template>
  <div class="submit-task-container">
    <h1>{{ pageTitle }}</h1>
    <LoadingSpinner :loading="loading" />
    <BaseForm
      :fields="taskFields"
      :columns="taskFields.length"
      :submitHandler="submitTask"
      v-model:formData="taskValues"
    />
    <Popup ref="popup" />
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';

import messages from '../../../utils/messages.js';
import { getByIdTask, putTask, postTask } from '../../../services/api.js';

import Popup from '../../../components/Popup.vue';
import BaseForm from '../../../components/BaseForm.vue';
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

const loading = ref(false);
const popup = ref(null);
const router = useRouter();
const emit = defineEmits(['reloadKanban']);

const props = defineProps({
  isEdit: {
    type: Boolean,
  },
  taskId: {
    type: Number,
  },
  categoryId: {
    type: Number,
    required: true,
  },
});

const pageTitle = computed(() => (props.isEdit ? 'Edit task' : 'Add task'));

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

const getDefaultValues = () => ({
  title: '',
  description: '',
  priority: 0,
  status: 0,
  deadline: new Date().toISOString().split('T')[0],
});

const taskValues = ref(getDefaultValues());

watchEffect(() => {
  if (props.isEdit && props.taskId) {
    loadTaskData();
  }
});

onMounted(() => {
  if (props.isEdit) {
    loadTaskData();
  }
});

async function loadTaskData() {
  loading.value = true;
  try {
    const task = await getByIdTask(props.taskId);
    taskValues.value = { ...getDefaultValues(), ...task };
  } catch (error) {
    if (error.response?.status === 403) {
      router.push('/error');
    } else {
      triggerPopup(messages.taskLoadError);
    }
  } finally {
    loading.value = false;
  }
}

async function submitTask(formData = taskValues.value) {
  loading.value = true;

  const isEdit = props.isEdit;
  const action = isEdit
    ? () => putTask(formData, props.taskId)
    : () => postTask(formData);

  try {
    formData.category_id = props.categoryId;
    const response = await action();
    if (response) {
      handleSuccess(isEdit);
    }
  } catch (error) {
    handleError(error, isEdit);
  } finally {
    loading.value = false;
  }
}

function handleSuccess(isEdit) {
  const message = isEdit ? messages.taskUpdate : messages.taskRegister;
  triggerPopup(message);
  setTimeout(() => emit('reloadKanban'), 2000);
}

function handleError(error, isEdit) {
  if (error.response?.status === 403) {
    router.push('/error');
  } else {
    const message = isEdit
      ? messages.taskUpdateError
      : messages.taskRegisterError;
    triggerPopup(message);
  }
}

const triggerPopup = (message) => {
  popup.value?.showPopup(message);
};
</script>

<style scoped>
.submit-task-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
