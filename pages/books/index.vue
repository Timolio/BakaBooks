<template>
    <h1>Тут будэт жэст</h1>
    <input type="text" v-model="title" />
    <button @click="createBook">Создать карася</button>
    <button @click="inviteBot">Создать комманду</button>
</template>

<script setup>
const { useWebApp, useWebAppNavigation } = await import('vue-tg');
const bookStore = useBookStore();
const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();

const title = ref('');
const config = useRuntimeConfig();

const inviteBot = () => {
    const rights = 'invite_users+manage_chat';
    const inviteLink = `https://t.me/${config.public.BOT_ID}?startchannel&admin=${rights}`;
    openTelegramLink(inviteLink);
};

const createBook = async () => {
    const bookId = await bookStore.createBook({
        title: title.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/books/${bookId}`);
};
</script>
