<template>
    <div class="dropdown-wrapper">
        <label class="dropdown-label">{{ label }}</label>
        <div class="dropdown" :class="{ open: isOpen }" @click="toggleDropdown">
            <div class="dropdown-trigger">
                <span>{{ selectedLabel }}</span>
                <i class="arrow"></i>
            </div>
            <div class="dropdown-menu" v-if="isOpen">
                <!-- Первый вариант: пустой -->
                <div
                    v-if="modelValue !== null"
                    class="dropdown-item"
                    @click.stop="clearSelection"
                ></div>
                <!-- Остальные варианты -->
                <div
                    class="dropdown-item"
                    v-for="(option, index) in filteredOptions"
                    :key="index"
                    @click.stop="selectOption(option)"
                >
                    {{ option[labelProperty] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    options: {
        type: Array,
        required: true,
        default: [],
    },
    modelValue: {
        type: [String, Number],
        default: null,
    },
    labelProperty: {
        type: String,
        default: 'label',
    },
    label: {
        type: String,
        default: '',
    },
    valueProperty: {
        type: String,
        default: 'value',
    },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const selectedLabel = computed(() => {
    const selected = props.options.find(
        option => option[props.valueProperty] === props.modelValue
    );
    return selected ? selected[props.labelProperty] : '';
});

const filteredOptions = computed(() => {
    return props.options.filter(
        option => option[props.valueProperty] !== props.modelValue
    );
});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const selectOption = option => {
    emit('update:modelValue', option[props.valueProperty]);
    isOpen.value = false;
};

const clearSelection = () => {
    emit('update:modelValue', null);
    isOpen.value = false;
};
</script>

<style scoped>
.dropdown-wrapper {
    display: flex;
    flex-direction: column;
}

.dropdown-label {
    font-weight: 400;
    color: #c4c4c5;
    font-size: 0.9rem;
    padding-bottom: 6px;
}

.dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    user-select: none;
}

.dropdown-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    background: #fff;
    min-height: 40px;
}

.dropdown-trigger .arrow {
    border: solid black;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
}

.dropdown.open .arrow {
    transform: rotate(-135deg);
}

.dropdown.open .dropdown-trigger {
    border-radius: 8px 8px 0 0;
}

.dropdown.open .dropdown-menu {
    border-radius: 0 0 8px 8px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 8px;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.dropdown-item {
    padding: 10px;
    cursor: pointer;
    border-top: 1px solid #ccc;
    min-height: 40px;
}

.dropdown-item:hover {
    background: #f0f0f0;
}
</style>
