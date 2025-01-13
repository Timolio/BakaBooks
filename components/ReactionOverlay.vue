<template>
    <Transition name="fade">
        <div v-if="show" :style="overlayStyle" class="reaction-overlay">
            <ReactionMarker
                v-for="(reaction, index) in activeBlockRect.reactions"
                :key="index"
                :reaction="reaction"
                :imageWidth="imageWidth"
                :imageHeight="imageHeight"
            />
        </div>
    </Transition>
</template>

<script setup>
const props = defineProps({
    activeBlockRect: {
        type: Object,
        default: () => ({ x: 0, y: 0, width: 0, height: 0 }),
    },
    show: Boolean,
});

const overlayStyle = computed(() => {
    return {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${props.activeBlockRect.x}px, ${props.activeBlockRect.y}px)`,
        width: `${props.activeBlockRect.width}px`,
        height: `${props.activeBlockRect.height}px`,
        pointerEvents: 'none', // важно, чтобы ловить клики
        zIndex: 2500,
    };
});

const imageWidth = computed(() => props.activeBlockRect.width);
const imageHeight = computed(() => props.activeBlockRect.height);
</script>

<style scoped>
.reaction-overlay {
    overflow: hidden;
}
</style>
