<template>
    <Transition name="fade">
        <div v-if="show" :style="overlayStyle" class="reaction-overlay">
            <ReactionMarker
                v-for="(reaction, index) in activeBlockRect.reactions"
                :key="index"
                :reaction="reaction"
                :imageWidth="imageWidth"
                :imageHeight="imageHeight"
                @click.stop="openReaction(reaction)"
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

const openReaction = reaction => {
    const r = {
        sticker: reaction.type,
        comment: reaction.content,
    };
    emit('open', r);
};

const overlayStyle = computed(() => {
    return {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${props.activeBlockRect.x}px, ${props.activeBlockRect.y}px)`,
        width: `${props.activeBlockRect.width}px`,
        height: `${props.activeBlockRect.height}px`,
        zIndex: 2500,
    };
});

const emit = defineEmits(['open']);

const imageWidth = computed(() => props.activeBlockRect.width);
const imageHeight = computed(() => props.activeBlockRect.height);
</script>

<style scoped>
.reaction-overlay {
    pointer-events: auto;
    overflow: hidden;
    z-index: 1000;
}
</style>
