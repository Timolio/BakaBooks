<script setup>
useHead({
    script: [
        {
            src: 'https://telegram.org/js/telegram-web-app.js',
            defer: true,
        },
        {
            src: 'https://sad.adsgram.ai/js/sad.min.js',
            async: true,
        },
    ],
    meta: [
        {
            name: 'viewport',
            content:
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        },
    ],
});
</script>

<template>
    <main>
        <ClientOnly>
            <slot />
            <StartApp />
        </ClientOnly>
    </main>
</template>
