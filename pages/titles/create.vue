<template>
    <div id="dashboard">
        <div class="header">
            <div class="section-title">
                <h1>Ваши тайтлы</h1>
            </div>
        </div>
        <Field v-model="title" label="Название тайтла" />
        <button @click="createTitle" class="card-btn">Создать тайтл</button>
        <!-- <div class="field">
            <h2>Создать команду</h2>
            <button @click="inviteBot">Создать команду</button>
        </div> -->
        <BackButton @click="goBack" />
    </div>
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

<style scoped>
.field-label {
    font-weight: 400;
    color: #c4c4c5;
    font-size: 0.9rem;
    padding-bottom: 6px;
}

.field {
    display: flex;
    flex-direction: column;
}

.field-wrap {
    height: 40px;
    padding: 0 10px;
    background-color: #1c1c1e;
    border-radius: 8px;
    border: 1px solid transparent;
}

.field-wrap input {
    width: 100%;
    height: 100%;
    padding: 10px 0;
    border: none;
    font-weight: 400;
    background-color: transparent;
    outline: none;
}
</style>
