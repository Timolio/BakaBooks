<template>
    <div class="dropdown" :class="{ open: isOpen }" @click="toggleDropdown">
        <div class="dropdown-trigger">
            <span>{{ selectedLabel }}</span>
            <i class="arrow"></i>
        </div>
        <div class="dropdown-menu" v-if="isOpen">
            <div
                class="dropdown-item"
                v-for="(option, index) in options"
                :key="index"
                @click.stop="selectOption(option)"
            >
                {{ option.label }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    options: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: [String, Number],
        default: null,
    },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const selectedLabel = computed(() => {
    const selected = props.options.find(
        option => option.value === props.modelValue
    );
    return selected ? selected.label : 'Select an option';
});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const selectOption = option => {
    emit('update:modelValue', option.value);
    isOpen.value = false;
};
</script>

<style scoped>
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
    border-radius: 4px;
    cursor: pointer;
    background: #fff;
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

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 5px;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
    padding: 10px;
    cursor: pointer;
}

.dropdown-item:hover {
    background: #f0f0f0;
}
</style>
