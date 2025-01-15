<template>
    <div class="creation">
        <h2>Создать тайтл</h2>
        <input type="text" v-model="title" />
        <button @click="createTitle">Создать тайтл</button>
    </div>
    <div class="creation">
        <h2>Создать команду</h2>
        <button @click="inviteBot">Создать команду</button>
    </div>
    <BackButton @click="goBack" />
</template>

<script setup>
const { useWebApp, useWebAppNavigation, BackButton } = await import('vue-tg');
const { openTelegramLink } = useWebAppNavigation();
const { initDataUnsafe } = useWebApp();

const chapterStore = useChapterStore();

const title = ref('');
const config = useRuntimeConfig();

const inviteBot = () => {
    const rights = 'invite_users+manage_chat';
    const inviteLink = `https://t.me/${config.public.BOT_ID}?startchannel&admin=${rights}`;
    openTelegramLink(inviteLink);
};

const goBack = async () => {
    await navigateTo('/dashboard');
};

const createTitle = async () => {
    const titleId = await chapterStore.createTitle({
        name: title.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/titles/${titleId}`);
};
</script>

<style scoped></style>
