<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <div class="form-grid" :style="gridStyle">
      <div v-for="(field, index) in fields" :key="index" class="form-field">
        <label :for="field.name">{{ field.label }}</label>

        <!-- color -->
        <div v-if="field.type === 'color'" class="color-picker">
          <input
            type="color"
            v-model="formData[field.name]"
            :id="field.name"
            :required="field.required"
          />
        </div>

        <!-- icon -->
        <div v-else-if="field.name === 'icon'" class="icon-selector">
          <div class="icon-grid">
            <button
              v-for="option in field.options"
              :key="option"
              @click.prevent="formData[field.name] = option"
              :class="{ selected: formData[field.name] === option }"
            >
              <i :class="option" class="icons"></i>
            </button>
          </div>
        </div>

        <!-- select -->
        <div v-else-if="field.type === 'select'">
          <select
            v-model="formData[field.name]"
            :id="field.name"
            :required="field.required"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <input
          v-else
          :type="field.type"
          v-model="formData[field.name]"
          :placeholder="field.placeholder || ''"
          :id="field.name"
          :required="field.required"
          :min="field.type === 'number' ? 0 : undefined"
        />
      </div>
    </div>
    <button type="submit" :disabled="!isFormValid">Salvar</button>
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

const modelFormData = defineModel('formData');
const internalFormData = ref({});

const formData = computed({
  get: () => modelFormData.value ?? internalFormData.value,
  set: (val) => {
    if (modelFormData.value !== undefined) {
      modelFormData.value = val;
    } else {
      internalFormData.value = val;
    }
  },
});

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '15px',
}));

const isFormValid = computed(() => {
  return props.fields.every((field) => {
    const value = formData.value[field.name];

    if (!field.required) return true;

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    return value !== null && value !== undefined;
  });
});

function getInitialValue(field) {
  if (field.type === 'color') {
    return '#000000';
  } else if (field.type === 'date') {
    return new Date().toISOString().split('T')[0];
  } else if (field.type === 'number' || field.type === 'select') {
    return field.options?.[0]?.value ?? 0;
  }
  return '';
}

function initializeForm() {
  formData.value = Object.fromEntries(
    props.fields.map((field) => [field.name, getInitialValue(field)])
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
  color: black;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker input[type='color'] {
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  padding: 0;
  appearance: none;
}

.color-picker input[type='color']::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker input[type='color']::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}

.color-picker .color-code {
  width: 100px;
  text-align: center;
  border: 1px solid #ccc;
  padding: 5px;
}

.icon-selector {
  display: flex;
  flex-direction: column;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin-top: 10px;
}

.icon-grid button {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  padding: 10px;
}

.icon-grid button.selected {
  border: 2px solid #646cff;
  border-radius: 5px;
}

.icons {
  font-size: 32px;
  color: #333;
}

select {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
