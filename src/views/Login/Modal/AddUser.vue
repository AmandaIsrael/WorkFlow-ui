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
import messages from '../../../utils/messages';
import Popup from '../../../components/Popup.vue';
import { register } from '../../../services/api.js';
import BaseForm from '../../../components/BaseForm.vue';
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

const loading = ref(false);
const popup = ref(null);
const emit = defineEmits();

const userFields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
];

async function saveUser(formData) {
  loading.value = true;

  try {
    const response = await register(formData);
    console.log(response);
    if (response) {
      triggerPopup(messages.userRegister);
    }
  } catch (error) {
    triggerPopup(messages.registerError);
  } finally {
    loading.value = false;
    setTimeout(() => {
      emit('closeModal');
    }, 3000);
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
