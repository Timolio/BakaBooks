<template>
    <div class="reaction-marker" :style="markerStyle">
        <img :src="'/img/' + reaction.type + '.png'" />
    </div>
</template>

<script setup>
const props = defineProps({
    reaction: {
        type: Object,
        required: true,
    },
    imageWidth: {
        type: Number,
        default: 0,
    },
    imageHeight: {
        type: Number,
        default: 0,
    },
});

const markerStyle = computed(() => {
    const leftPx = (props.reaction.x / 100) * props.imageWidth;
    const topPx = (props.reaction.y / 100) * props.imageHeight;
    return {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        left: `${leftPx}px`,
        top: `${topPx}px`,
        fontSize: '20px',
        userSelect: 'none',
        zIndex: 2000,
    };
});
</script>

<style scoped>
.reaction-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 20px;
    user-select: none;
    pointer-events: auto;
    z-index: 5000;
}

.reaction-marker img {
    display: block;
    width: 80px;
    height: auto;
}
</style>
