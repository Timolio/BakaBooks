<script setup>
const { useWebApp, useWebAppViewport, useWebAppTheme } = await import('vue-tg');
const { disableVerticalSwipes, expand } = useWebAppViewport();
const { setHeaderColor, setBackgroundColor } = useWebAppTheme();

setHeaderColor('#111113');
setBackgroundColor('#111113');
disableVerticalSwipes();
expand();
</script>

<template></template>
