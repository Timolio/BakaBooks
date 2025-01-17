<template>
    <Transition name="fade">
        <div class="nav-panel" v-if="show">
            <div class="nav-panel__page" v-if="total">
                <button>{{ current }}/{{ total }}</button>
            </div>
            <div
                class="nav-panel__bar"
                :style="{ gridTemplateColumns: `repeat(${tools.length}, 1fr)` }"
            >
                <button
                    class="toolbar-btn"
                    v-for="tool in tools"
                    :class="{ disabled: tool.disabled }"
                    @click="$emit('tool-click', tool.name)"
                    :disabled="tool.disabled || disabled"
                >
                    <BootstrapIcon :name="tool.icon" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: true,
    },
    tools: {
        type: Array,
        default: () => [],
    },
    disabled: {
        type: Boolean.app,
        default: false,
    },
    current: {
        type: Number,
        default: 1,
    },
    total: {
        type: Number,
        default: 1,
    },
});

const emit = defineEmits(['tool-click']);
</script>

<style scoped>
.nav-panel {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    z-index: 1500;
}

.nav-panel__bar {
    background-color: #1c1c1e;
    border-radius: 8px;
    display: grid;
    pointer-events: auto;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    height: 48px;
    margin-top: 10px;
}

.nav-panel__page {
    max-width: 64px;

    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

.nav-panel.hidden {
    pointer-events: none;
    z-index: -1;
}

.nav-panel__page button {
    font-size: 0.9rem;
    height: 34px;
    padding: 0 12px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #f1f1f1;
    border: none;
    border-radius: 8px;
}

.toolbar-btn {
    font-size: 1rem;
    position: relative;
    background-color: transparent;
    color: #c4c4c5;
    width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: none;
    transition: color 0.2s;
    border-radius: 8px;
}

.toolbar-btn:disabled {
    color: #6b6b6c;
    cursor: not-allowed;
    pointer-events: none;
}

.toolbar-btn:hover {
    cursor: pointer;
    color: #fff;
    background-color: #18181a;
}

.toolbar-btn:active {
    cursor: pointer;
    color: #fff;
}
</style>
