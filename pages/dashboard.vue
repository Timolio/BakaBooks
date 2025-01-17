<template>
    <div id="dashboard">
        <Loading :show="titles === null" />
        <div class="header">
            <div class="section-title">
                <h1>Ваши тайтлы</h1>
            </div>
            <button
                class="new-title-btn"
                @click="navigateTo('/titles/create')"
                :disabled="titles === null"
            >
                <span>Создать тайтл</span>
                <BootstrapIcon class="icon" name="plus" />
            </button>
        </div>

        <div class="main-section">
            <div class="list-items" v-if="titles?.length > 0">
                <div v-for="title in titles" class="card">
                    <div class="card-cover"></div>
                    <div class="card-body">
                        <h3 class="card-title">{{ title.name }}</h3>
                        <div class="card-controls">
                            <button
                                class="card-btn"
                                @click="openTitle(title._id)"
                            >
                                Открыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="titles?.length === 0" class="list-message">
                <div class="list-icon">
                    <img src="/img/nothing-icon.png" style="height: 200px" />
                </div>
                <p>Кажется, здесь пока пусто...</p>
            </div>
        </div>
        <div class="field">
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

const { titles, title, currentTitleChapters } = storeToRefs(chapterStore);

const config = useRuntimeConfig();

const openTitle = async titleId => {
    if (title.value?._id !== titleId) {
        title.value = null;
        currentTitleChapters.value = null;
    }
    await navigateTo(`/titles/${titleId}`);
};

const inviteBot = () => {
    const rights = 'invite_users+manage_chat';
    const inviteLink = `https://t.me/${config.public.BOT_ID}?startchannel&admin=${rights}`;
    openTelegramLink(inviteLink);
};

onMounted(async () => {
    await chapterStore.fetchTitles(initDataUnsafe?.user?.id || 404);
});
</script>

<style>
.card-body {
    justify-content: space-between;
}

.site-icon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.site-icon img {
    height: 50px;
    width: auto;
}
</style>
