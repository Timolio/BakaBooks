<template>
    <div id="dashboard">
        <div class="header">
            <h1>Ваши тайтлы</h1>
        </div>

        <div class="main-section">
            <div v-for="title in titles" class="card">
                <div class="card-cover"></div>
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
        <div class="creation">
            <h2>Создать тайтл</h2>
            <input type="text" v-model="title" />
            <button @click="createTitle">Создать тайтл</button>
        </div>
        <div class="creation">
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
    const rights = 'invite_users+manage_chat';
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
.header {
    margin: 12px 13px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #3a995e;
}

.creation {
    margin-top: 12px;
}

h1 {
    color: #f1f1f1;
    font-weight: 500;
    font-size: 1.1rem;
}
</style>
