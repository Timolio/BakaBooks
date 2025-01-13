<script setup>
const { useWebAppViewport, useWebAppTheme } = await import('vue-tg');

const { disableVerticalSwipes, expand } = useWebAppViewport();
const { setHeaderColor, setBackgroundColor } = useWebAppTheme();

onMounted(async () => {
    setHeaderColor('#111113');
    disableVerticalSwipes();
    expand();
});
</script>

<template></template>
