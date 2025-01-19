<template>
    <div
        @click="console.log('hey')"
        v-if="show"
        class="reaction-picker"
        :style="pickerStyle"
    >
        <img v-if="sample?.sticker" :src="'/img/' + sample?.sticker + '.png'" />
    </div>
</template>

<script setup>
const props = defineProps({
    show: Boolean,
    pickerX: Number,
    pickerY: Number,
    sample: Object,
});
const emit = defineEmits(['pick']);

const pickerStyle = computed(() => ({
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: `${props.pickerY}px`,
    left: `${props.pickerX}px`,
    background: 'none',
    zIndex: 3000,
}));
</script>

<style scoped>
.reaction-picker button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    margin-right: 6px;
}

.reaction-picker img {
    display: block;
    width: 64px;
    height: auto;
}
</style>
