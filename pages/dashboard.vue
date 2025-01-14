<template>
    <div id="dashboard">
        <h1>Ваши книги</h1>
        <div v-if="titles?.length === 0">
            <p>У вас пока нет книг. Создайте первую книгу!</p>
        </div>
        <div class="main-section">
            <div v-for="title in titles" class="card">
                <div class="card-body">
                    <h3 class="card-title">{{ title.name }}</h3>
                    <div class="card-controls">
                        <button class="card-btn" @click="openTitle(title._id)">
                            Открыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h2>Создать тайтл</h2>
            <input type="text" v-model="title" />
            <button @click="createTitle">Создать тайтл</button>
        </div>
        <div>
            <h2>Создать команду</h2>
            <button @click="inviteBot">Создать команду</button>
        </div>
    </div>
</template>

<script setup>
const { useWebApp, useWebAppNavigation } = await import('vue-tg');
const chapterStore = useChapterStore();
const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();
const { titles } = storeToRefs(chapterStore);

const title = ref('');
const config = useRuntimeConfig();

const openTitle = async titleId => {
    await navigateTo(`/titles/${titleId}`);
};

const inviteBot = () => {
    const rights = 'invite_users,manage_chat';
    const inviteLink = `https://t.me/${config.public.BOT_ID}?startchannel&admin=${rights}`;
    openTelegramLink(inviteLink);
};

const createTitle = async () => {
    const titleId = await chapterStore.createTitle({
        name: title.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/titles/${titleId}`);
};

onMounted(async () => {
    await chapterStore.fetchTitles(initDataUnsafe?.user?.id || 404);
});
</script>

<style scoped>
h1 {
    color: #f1f1f1;
}
</style>
