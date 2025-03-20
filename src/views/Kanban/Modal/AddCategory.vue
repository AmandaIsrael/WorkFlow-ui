<template>
  <div class="add-category-container">
    <h1>Add category</h1>
    <LoadingSpinner :loading="loading" />
    <BaseForm
      :fields="categoryFields"
      :columns="categoryFields.length"
      :submitHandler="saveCategory"
    />
    <Popup ref="popup" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import messages from '../../../utils/messages';
import Popup from '../../../components/Popup.vue';
import { postCategory } from '../../../services/api.js';
import BaseForm from '../../../components/BaseForm.vue';
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

const loading = ref(false);
const popup = ref(null);
const router = useRouter();
const emit = defineEmits(['reloadKanban']);

const categoryFields = [
  { name: 'name', label: 'Nome', type: 'text', required: true },
  { name: 'color', label: 'Cor', type: 'color', required: false },
  {
    name: 'icon',
    label: 'Ícone',
    type: 'select',
    required: true,
    options: [
      'fa-solid fa-pencil-alt',
      'fa-solid fa-check-circle',
      'fa-solid fa-fire',
    ],
  },
];

async function saveCategory(formData) {
  loading.value = true;

  try {
    const response = await postCategory(formData);
    if (response) {
      triggerPopup(messages.categoryRegister);
      setTimeout(() => {
        emit('reloadKanban');
      }, 2000);
    }
  } catch (error) {
    error.response?.status === 403
      ? router.push('/error')
      : triggerPopup(messages.categoryError);
  } finally {
    loading.value = false;
  }
}

const triggerPopup = (message) => {
  popup.value.showPopup(message);
};
</script>

<style scoped>
.add-category-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
