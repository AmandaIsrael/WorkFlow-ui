<template>
  <div class="submit-category-container">
    <h1>{{ pageTitle }}</h1>
    <LoadingSpinner :loading="loading" />
    <BaseForm
      :fields="categoryFields"
      :columns="categoryFields.length"
      :submitHandler="submitCategory"
      v-model:formData="categoryValues"
    />
    <Popup ref="popup" />
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';

import messages from '../../../utils/messages.js';
import {
  getByIdCategory,
  putCategory,
  postCategory,
} from '../../../services/api.js';

import { iconList } from '../../../utils/iconList.js';
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
  categoryId: {
    type: Number,
  },
});

const pageTitle = computed(() =>
  props.isEdit ? 'Edit category' : 'Add category'
);

const categoryFields = [
  { name: 'name', label: 'Nome', type: 'text', required: true },
  { name: 'color', label: 'Cor', type: 'color', required: false },
  {
    name: 'icon',
    label: 'Ícone',
    type: 'select',
    required: true,
    options: iconList,
  },
];

const getDefaultValues = () => ({
  name: '',
  color: '#000000',
  icon: '',
});

const categoryValues = ref(getDefaultValues());

watchEffect(() => {
  if (props.isEdit && props.categoryId) {
    loadCategoryData();
  }
});

onMounted(() => {
  if (props.isEdit) {
    loadCategoryData();
  }
});

async function loadCategoryData() {
  loading.value = true;
  try {
    const category = await getByIdCategory(props.categoryId);
    categoryValues.value = { ...getDefaultValues(), ...category };
  } catch (error) {
    if (error.response?.status === 403) {
      router.push('/error');
    } else {
      triggerPopup(messages.categoryLoadError);
    }
  } finally {
    loading.value = false;
  }
}

async function submitCategory(formData = categoryValues.value) {
  loading.value = true;

  const isEdit = props.isEdit;
  const action = isEdit
    ? () => putCategory(formData, props.categoryId)
    : () => postCategory(formData);

  try {
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
  const message = isEdit ? messages.categoryUpdate : messages.categoryRegister;
  triggerPopup(message);
  setTimeout(() => emit('reloadKanban'), 2000);
}

function handleError(error, isEdit) {
  if (error.response?.status === 403) {
    router.push('/error');
  } else {
    const message = isEdit
      ? messages.categoryUpdateError
      : messages.categoryRegisterError;
    triggerPopup(message);
  }
}

const triggerPopup = (message) => {
  popup.value?.showPopup(message);
};
</script>

<style scoped>
.submit-category-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
