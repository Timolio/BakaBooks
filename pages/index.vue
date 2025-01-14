<script setup>
const { useWebApp } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();
const route = useRoute();
const bookStore = useBookStore();

onMounted(async () => {
    const startApp = initDataUnsafe?.start_param || route.query?.startapp;
    if (!startApp) {
        await navigateTo('/books');
        return;
    }
    await navigateTo(`/books/${startApp}`);
});
</script>

<template>
    <div>
        <h1>Загрузка...</h1>
    </div>
</template>
