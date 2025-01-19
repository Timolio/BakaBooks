<template>
    <div :class="{ open: show && mode === 'sidebar' }" class="reaction-sidebar">
        <div class="reaction-sidebar__header">
            <h3 class="caption">Реакции</h3>
            <button class="close1-button" @click="closeSidebar">
                <BootstrapIcon name="x-lg" />
            </button>
        </div>
        <div class="reaction-sidebar__inner">
            <button class="card-btn" @click="next($event)">Оставить</button>
        </div>
    </div>
    <div
        :class="{ upper: mode === 'textarea' }"
        class="reaction-sidebar-wrapper"
        v-if="show || comment"
    >
        <Transition name="fade">
            <div
                v-if="mode !== 'sticker'"
                class="backdrop"
                @click="closeSidebar"
            ></div>
        </Transition>
        <Transition name="fade">
            <div
                class="nav-panel"
                :class="{ upper: mode === 'textarea' }"
                v-if="(show && mode !== 'sidebar') || comment"
            >
                <div v-if="comment" class="comment">
                    {{ modelValue.comment }}
                </div>
                <div class="nav-panel__settings">
                    <textarea
                        v-if="mode === 'textarea' && !comment"
                        @input="reaction.comment = $event.target.value"
                        @focus="focused = true"
                        @blur="focused = false"
                        ref="textarea"
                        placeholder="Напишите что-нибудь... (необязательно)"
                    ></textarea>
                    <div class="nav-panel__stickers" v-if="mode === 'sticker'">
                        <button @click="pickSticker('happy-fox')">
                            <img class="sticker" src="/img/happy-fox.png" />
                        </button>
                        <button @click="pickSticker('crybaby')">
                            <img class="sticker" src="/img/crybaby.png" />
                        </button>
                        <button @click="pickSticker('shaky')">
                            <img class="sticker" src="/img/shaky.png" />
                        </button>
                    </div>
                </div>
                <div v-if="!comment" class="nav-panel__controls">
                    <button class="close2-button" @click="back">
                        <BootstrapIcon name="x-lg" />
                    </button>
                    <button class="accept-button" @click="next">
                        <BootstrapIcon name="check-lg" />
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
const mode = ref('sidebar');
const textarea = ref(null);
const reaction = ref({
    sticker: null,
    comment: null,
});

const props = defineProps({
    modelValue: Object,
    show: {
        type: Boolean,
        default: false,
    },
    comment: {
        type: Boolean,
        default: false,
    },
});

watch(
    () => reaction,
    newValue => {
        emit('update:modelValue', newValue);
    },
    { deep: true }
);

const back = () => {
    if (mode.value === 'sidebar') emit('close');
    else if (mode.value === 'textarea') mode.value = 'sidebar';
    else if (mode.value === 'sticker') mode.value = 'textarea';
    else if (mode.value === 'comment') closeSidebar();
};
const next = event => {
    if (mode.value === 'sidebar') {
        mode.value = 'textarea';
        event.preventDefault();
        // nextTick(() => {
        //     textarea.value?.focus();
        // });
    } else if (mode.value === 'textarea') {
        mode.value = 'sticker';
    } else if (mode.value === 'sticker') {
        if (reaction.value.sticker === null) return;
        emit('created', reaction.value);
    }
};

const closeSidebar = () => {
    reaction.value.sticker = null;
    reaction.value.comment = null;
    mode.value = 'sidebar';
    emit('close');
};

const pickSticker = stickerName => {
    reaction.value.sticker = stickerName;
};

const emit = defineEmits(['close', 'update:modelValue', 'created']);
</script>

<style scoped>
.reaction-sidebar-wrapper {
    position: fixed;
    overflow-y: auto;
    z-index: 4000;
    top: 0;
    left: 0;
    height: 100%;
    width: 100vw;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    pointer-events: none;
}

.reaction-sidebar-wrapper.upper {
    justify-content: flex-start;
}

.nav-panel {
    z-index: 2000;
    background-color: #1c1c1e;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.nav-panel__settings {
    background-color: transparent;
    border-radius: 8px;
    display: flex;
    pointer-events: auto;
    align-items: center;
    justify-content: flex-start;
}
.nav-panel__stickers button {
    background: none;
}
.nav-panel__stickers {
    padding: 10px;
    display: flex;
    gap: 10px;
}

.nav-panel__controls {
    background-color: transparent;
    display: flex;
    pointer-events: auto;
    margin: 10px;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
}

textarea {
    background-color: #1c1c1e;
    outline: none;
    resize: none;
    border: none;
    border-radius: 8px;
    min-height: 80px;
    width: 100%;
    padding: 10px;
    color: #f1f1f1;
    font-weight: 500;
    font-size: 1rem;
}

.comment {
    color: #f1f1f1;
    padding: 10px;
    font-weight: 500;
    font-size: 1rem;
}

.sticker {
    width: 64px;
    height: auto;
    animation: spring 1s ease-out forwards;
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

.reaction-sidebar__header {
    padding: 20px 20px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.reaction-sidebar__inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}

button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 8px;
}

.close1-button {
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
    background-color: #1c1c1e;
    color: #fff;
}

.close2-button {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    background-color: #1c1c1e;
    color: #fff;
}

.accept-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    background-color: var(--accent-color);
    color: #fff;
}

.reaction-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    max-width: 100%;
    max-height: 100%;
    z-index: 5000;
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

.reaction-sidebar.open {
    opacity: 1;
    visibility: visible;
    transform: translate(0);
}

/* .tool-panel {
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
} */
</style>
