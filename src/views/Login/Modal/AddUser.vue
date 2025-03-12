<template>
  <div class="add-user-container">
    <h1>Sign-up</h1>
    <LoadingSpinner :loading="loading" />
    <BaseForm
      :fields="userFields"
      :columns="userFields.length"
      :submitHandler="saveUser"
    />
  </div>
</template>

<script setup>
import LoadingSpinner from '../../../components/LoadingSpinner.vue';
import BaseForm from '../../../components/BaseForm.vue';
import { register } from '../../../services/api.js';
import { ref } from 'vue';

const userFields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
];

const loading = ref(false);

async function saveUser(formData) {
  loading.value = true;
  
  try {
    const response = await register(formData);
  } finally {
    loading.value = false;
    console.log(response);
  }
}
</script>

<style scoped>
.add-user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
