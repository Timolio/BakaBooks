<template>
    <div v-if="show" class="reaction-picker" :style="pickerStyle">
        <button v-for="emoji in emojis" :key="emoji" @click="pick(emoji)">
            {{ emoji }}
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    show: Boolean,
    pickerX: Number,
    pickerY: Number,
    emojis: {
        type: Array,
        default: () => ['🔥', '😂', '😮', '😢', '❤️'],
    },
});
const emits = defineEmits(['pick']);

const pickerStyle = computed(() => ({
    position: 'absolute',
    top: `${props.pickerY}px`,
    left: `${props.pickerX}px`,
    background: 'white',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 3000,
}));

function pick(emoji) {
    emits('pick', emoji);
}
</script>

<style scoped>
.reaction-picker button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    margin-right: 6px;
}
</style>
