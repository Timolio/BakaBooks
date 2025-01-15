<template>
    <div id="error">
        <h2>{{ error?.statusCode }}</h2>
        <p>{{ error?.statusMessage }}</p>
        {{ error }}
        <button @click="handleError">Clear errors</button>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
    error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: '/' });
</script>

<style>
#error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    gap: 1rem;
    color: white;
}

#error p {
    font-size: 0.8rem;
}
</style>
