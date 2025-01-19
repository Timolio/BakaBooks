<template>
    <div class="reaction-marker" :style="markerStyle">
        <img :style="markerImgStyle" :src="'/img/' + reaction.type + '.png'" />
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

const markerImgStyle = computed(() => {
    const imgWidth = props.imageWidth * 0.15;
    return {
        width: `${imgWidth}px`,
    };
});

const markerStyle = computed(() => {
    const leftPx = (props.reaction.x / 100) * props.imageWidth;
    const topPx = (props.reaction.y / 100) * props.imageHeight;
    return {
        position: 'absolute',
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
    pointer-events: auto;
    z-index: 5000;
    transform: translate(-50%, -50%);
}

.reaction-marker img {
    display: block;
    height: auto;
    animation: spring 1s ease-out forwards;
}
</style>
