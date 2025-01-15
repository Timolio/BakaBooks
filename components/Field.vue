<template>
    <div class="field">
        <label class="field-label">{{ label }}</label>
        <div class="field-wrap" :class="{ active: isFocused }">
            <input
                type="text"
                :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)"
                @focus="isFocused = true"
                @blur="isFocused = false"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Пропсы для передачи данных
const props = defineProps({
    modelValue: String, // Двустороннее связывание
    label: String, // Текст для label
});

// Локальное состояние фокуса
const isFocused = ref(false);

// Эмит обновления значения input
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.field-label {
    font-weight: 400;
    color: #c4c4c5;
    font-size: 0.9rem;
    padding-bottom: 6px;
}

.field {
    display: flex;
    flex-direction: column;
}

.field-wrap {
    height: 40px;
    padding: 0 10px;
    background-color: #1c1c1e;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
}

.field-wrap input {
    width: 100%;
    height: 100%;
    padding: 10px 0;
    border: none;
    font-weight: 400;
    background-color: transparent;
    outline: none;
    color: #f1f1f1;
    font-weight: 400;
    font-size: 1rem;
}

.field-wrap.active {
    border-color: var(--accent-color); /* Пример: зеленая рамка при фокусе */
}
</style>
