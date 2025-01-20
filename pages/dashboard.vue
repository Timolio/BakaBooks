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
                <div class="info-item">
                    <img src="/img/background.webp" />
                    <div class="info">
                        <div>
                            <h2>Добавь бота в канал.</h2>
                            <h2>Получи доступ к крутым фичам.</h2>
                            <button @click="inviteBot">Узнать больше</button>
                        </div>
                    </div>
                </div>
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

.info-item img {
    position: relative;
    display: block;
    border-radius: 8px;
    width: 100%;
}

.info-item .info {
    padding: 12px 12px 12px 16px;
    margin: 4px;
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: calc(100% - 8px);
    height: calc(110.49px - 8px);
    border-radius: 5px;
    overflow: hidden;
    top: 0;
    left: 0;
}

.info h2 {
    font-weight: 400;
    font-size: 1.1rem;
    color: #f1f1f1;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.info div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
}

.info img {
    margin: 0 0 0 10px;
    width: 92px;
    height: 92px;
    flex-shrink: 0;
}

.info button {
    background: none;
    font-weight: 500;
    color: var(--accent-color);
    border: none;
    cursor: pointer;
    font-size: 1rem;
    text-align: left;
}

.info p {
    font-weight: 400;
    font-size: 0.9rem;
    color: #c5c5c4;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}
</style>
