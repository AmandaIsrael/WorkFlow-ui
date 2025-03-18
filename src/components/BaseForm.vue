<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <div class="form-grid" :style="gridStyle">
      <div v-for="(field, index) in fields" :key="index" class="form-field">
        <label :for="field.name">{{ field.label }}</label>
        <input
          :type="field.type || 'text'"
          v-model="formData[field.name]"
          :placeholder="field.placeholder || ''"
          :id="field.name"
        />
      </div>
    </div>
    <button type="submit">Salvar</button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  submitHandler: {
    type: Function,
    required: true,
  },
});

const formData = ref({});

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '15px',
}));

function initializeForm() {
  formData.value = Object.fromEntries(
    props.fields.map((field) => [field.name, ''])
  );
}

initializeForm();

function handleSubmit() {
  if (props.submitHandler) {
    props.submitHandler(formData.value);
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
}

.form-grid {
  display: grid;
  gap: 15px;
  width: 100%;
}

.form-field {
  display: flex;
  flex-direction: column;
}
</style>
