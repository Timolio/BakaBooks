<template>
    <Transition name="fade">
        <div v-if="show" class="backdrop" @click="$emit('close')"></div>
    </Transition>
    <div :class="{ open: show }" class="reader-sidebar">
        <div class="reader-sidebar__header">
            <h3 class="caption">Настройки</h3>
            <button class="close-button" @click="$emit('close')">
                <BootstrapIcon name="x-lg" />
            </button>
        </div>
        <div class="reader-sidebar__inner">
            <button class="close-button" @click="$emit('tool-click', 'book')">
                <BootstrapIcon name="book" />
            </button>
            <button class="close-button" @click="$emit('tool-click', 'feed')">
                <BootstrapIcon name="view-list" />
            </button>
            <button
                class="close-button"
                @click="$emit('tool-click', 'fullscreen')"
            >
                <BootstrapIcon name="fullscreen" />
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'tool-click']);
</script>

<style scoped>
.backdrop {
    background-color: #00000080;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 1900;
    cursor: pointer;
    pointer-events: all;
}

.caption {
    color: #f1f1f1;
    font-size: 1.15rem;
    font-weight: 700;
}

.reader-sidebar__header {
    padding: 20px 20px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.reader-sidebar__inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}

.close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
    outline: none;
    border: none;
    border-radius: 8px;
    background-color: #1c1c1e;
    color: #fff;
}

.reader-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    max-width: 100%;
    max-height: 100%;
    z-index: 2000;
    pointer-events: all;
    user-select: none;
    display: flex;
    transform: translate(100%);
    flex-direction: column;
    width: 440px;
    visibility: hidden;
    background-color: #111113;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s,
        visibility 0.4s;
}

.reader-sidebar.open {
    opacity: 1;
    visibility: visible;
    transform: translate(0);
}
</style>
