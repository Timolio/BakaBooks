<script setup>
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <Analytics />
</template>

<!-- <style>
:root {
    --tg-theme-accent-text-color: #6ab2f2;
    --tg-color-scheme: dark;
    --tg-theme-bg-color: #17212b;
    --tg-theme-button-color: #5288c1;
    --tg-theme-button-text-color: #ffffff;
    --tg-theme-destructive-text-color: #ec3942;
    --tg-theme-header-bg-color: #17212b;
    --tg-theme-hint-color: #708499;
    --tg-theme-link-color: #6ab3f3;
    --tg-theme-secondary-bg-color: #232e3c;
    --tg-theme-section-bg-color: #17212b;
    --tg-theme-section-header-text-color: #6ab3f3;
    --tg-theme-section-separator-color: #111921;
    --tg-theme-subtitle-text-color: #708499;
    --tg-theme-text-color: #f5f5f5;
}
</style> -->
