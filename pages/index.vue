<script setup>
const { useWebApp } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();
const route = useRoute();

onMounted(async () => {
    const startApp = initDataUnsafe?.start_param || route.query?.startapp;
    if (!startApp) {
        await navigateTo('/dashboard');
        return;
    }

    const decodedJson = Buffer.from(startApp, 'base64').toString('utf-8');
    const data = JSON.parse(decodedJson);

    if (!data.titleId || !data.chapterId) {
        await navigateTo('/dashboard');
        return;
    }

    await navigateTo(`/titles/${data.titleId}/books/${data.chapterId}`);
});
</script>

<template>
    <div>
        <h1>Загрузка...</h1>
    </div>
</template>
