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
          <button
            type="button"
            @click="toggleIconPicker(index)"
            class="icon-picker-btn"
          >
            {{ formData[field.name] ? 'Selected icon' : 'Select icon' }}
            <i
              v-if="formData[field.name]"
              :class="formData[field.name]"
              class="icons preview-icon"
            />
          </button>

          <div v-if="activeIconIndex === index" class="icon-popup">
            <div class="icon-grid">
              <button
                class="select-icon-btn"
                type="button"
                v-for="option in field.options"
                :key="option"
                @click.prevent="selectIcon(option, field.name)"
                :class="{ selected: formData[field.name] === option }"
              >
                <i :class="option" class="icons" />
              </button>
            </div>
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
const activeIconIndex = ref(null);

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

function toggleIconPicker(index) {
  activeIconIndex.value = activeIconIndex.value === index ? null : index;
}

function selectIcon(icon, fieldName) {
  formData.value[fieldName] = icon;
  activeIconIndex.value = null;
}

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
  position: relative;
}

.icon-picker-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 2px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.preview-icon {
  font-size: 1.2rem;
  color: black;
}

.icon-popup {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  width: 250px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}

.select-icon-btn {
  background-color: white;
  border: 2px solid #ccc;
}

.icons {
  font-size: 1.2rem;
  color: black !important;
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
