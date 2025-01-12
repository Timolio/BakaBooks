<script setup>
import { useBookStore } from '~/stores/bookStore';

const { useWebApp, useWebAppViewport, useWebAppTheme } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();
const { disableVerticalSwipes, expand } = useWebAppViewport();
const { setHeaderColor, setBackgroundColor } = useWebAppTheme();
const route = useRoute();
const bookStore = useBookStore();

setHeaderColor('#111113');
setBackgroundColor('#111113');
disableVerticalSwipes();
expand();

onMounted(async () => {
    let startApp = initDataUnsafe?.start_param || route.query?.startapp;
    if (!startApp) {
        startApp = await bookStore.createBook({
            title: 'Draft',
            authorId: initDataUnsafe?.user?.id || 404,
        });
    }
    await bookStore.fetchBook(startApp);
    await navigateTo(`/books/${startApp}`);
});
</script>

<template>
    <div>
        <h1>Загрузка...</h1>
    </div>
</template>
