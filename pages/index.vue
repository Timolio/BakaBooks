<script setup>
import { Buffer } from 'buffer';
const { useWebApp } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();
const route = useRoute();

const enterApp = async () => {
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

    await navigateTo(`/titles/${data.titleId}/chapters/${data.chapterId}`);
};
</script>

<template>
    <div id="dashboard">
        <div class="list-message">
            <div class="list-icon">
                <img src="/img/undergoing-icon.png" />
            </div>
            <p>
                Приложение находися в активной разработке и может содержать
                много багов и недоработок.
            </p>
            <button class="card-btn" @click="enterApp">
                Всё равно продолжить
            </button>
        </div>
    </div>
</template>

<style scoped>
.card-btn {
    margin-top: 16px;
}
</style>
