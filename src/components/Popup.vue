<template>
  <div v-if="isVisible" class="popup-overlay">
    <div class="popup">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isVisible = ref(false);

const message = ref('');

const showPopup = (msg) => {
  message.value = msg;
  isVisible.value = true;

  setTimeout(() => {
    isVisible.value = false;
  }, 3000);
};

defineExpose({
  showPopup,
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 10px;
}

.popup {
  background-color: #646cff;
  color: #eceaea;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  transition: opacity 0.3s ease-in-out;
}

p {
  margin: 0;
}
</style>
