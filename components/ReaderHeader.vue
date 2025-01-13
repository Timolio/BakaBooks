<template>
    <div class="reader-header" :class="{ hidden: !showUI }">
        <div class="nav-reader">
            <div class="nav-reader__caption" v-if="book">
                <h2>{{ book.title }}</h2>
                <p>{{ book.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    book: {
        type: Object,
        default: null,
    },
    showUI: {
        type: Boolean,
        default: true,
    },
});
</script>

<style scoped>
.reader-header {
    position: fixed;
    top: 0;
    left: 0;
    color: #f1f1f1;
    width: 100%;
    background-color: #111113;
    z-index: 1500;
    transition: transform 0.3s ease-in-out;
}

.reader-header.hidden {
    transform: translateY(-100%);
}

.nav-reader {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 48px;
}

.nav-reader__caption {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.nav-reader__caption p {
    font-weight: 400;
    margin-top: 2px;
    font-size: 0.75rem;
    line-height: 110%;
    color: #979798;
}
</style>
