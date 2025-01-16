<template>
    <Transition name="fade">
        <div class="tool-panel" v-if="show">
            <div class="tool-panel__comment">
                <div v-if="!creating"></div>
                <textarea v-else></textarea>
            </div>
            <div class="tool-panel__bar">
                <div class="tool-panel__main"></div>
                <button @click="$emit('close')" class="tool-panel__close">
                    <BootstrapIcon name="x" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
const creating = ref(false);

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.tool-panel {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;

    z-index: 1500;
}

.tool-panel__comment {
    background-color: #f1f1f1;
    border-radius: 8px;
    box-shadow: 0px 2px 10px #f1f1f120;
    width: 100%;
    height: auto;
}

.tool-panel__comment textarea {
    width: 100%;
    min-height: 48px;
    height: 100%;
    resize: none;
    border-radius: 8px;
    background: none;
    outline: none;
    padding: 5px;
    border: none;
}
.tool-panel__comment div {
    width: 100%;
    min-height: 48px;
    padding: 5px;
}

.tool-panel__bar {
    display: flex;
    gap: 10px;
    flex-direction: row;
}

.tool-panel__main {
    flex-grow: 1;
    background-color: #f1f1f1;
    border-radius: 8px;
    display: grid;
    pointer-events: auto;
    box-shadow: 0px 2px 10px #f1f1f120;
    height: 48px;
    margin-top: 10px;
}

.tool-panel__close {
    background-color: #f1f1f1;
    border-radius: 8px;
    pointer-events: auto;
    cursor: pointer;
    color: #353535;
    box-shadow: 0px 2px 10px #f1f1f120;
    height: 48px;
    width: 48px;
    margin-top: 10px;
    font-size: 1.6rem;
    outline: none;
    border: none;
}
</style>
