<template>
  <div class="add-user-container">
    <h1>Sign-up</h1>
    <LoadingSpinner :loading="loading" />
    <BaseForm
      :fields="userFields"
      :columns="userFields.length"
      :submitHandler="saveUser"
    />
    <Popup ref="popup" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import messages from '../../../utils/messages';
import Popup from '../../../components/Popup.vue';
import { register } from '../../../services/api.js';
import BaseForm from '../../../components/BaseForm.vue';
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

const loading = ref(false);
const popup = ref(null);
const router = useRouter();

const userFields = [
  { name: 'username', label: 'Username', type: 'text', required: true },
  { name: 'email', label: 'E-mail', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
];

async function saveUser(formData) {
  loading.value = true;

  try {
    const response = await register(formData);
    if (response) {
      triggerPopup(messages.userRegister);
      setTimeout(() => {
        router.push('/kanban');
      }, 2000);
    }
  } catch (error) {
    triggerPopup(messages.registerError);
  } finally {
    loading.value = false;
  }
}

const triggerPopup = (message) => {
  popup.value.showPopup(message);
};
</script>

<style scoped>
.add-user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
