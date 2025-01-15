<template>
    <div id="dashboard">
        <div class="header" v-if="title">
            <div class="section-title">
                <h1>{{ title.name }}</h1>
            </div>
            <button
                @click="navigateTo(`/titles/${titleId}/chapters/create`)"
                class="new-title-btn"
            >
                <span>Создать главу</span>
                <BootstrapIcon class="icon" name="plus" />
            </button>
        </div>
        <div class="main-section">
            <div v-for="chapter in currentTitleChapters" class="card">
                <div class="card-body">
                    <div class="card-info">
                        <p>{{ chapter.order }}</p>
                        <h3 class="card-title">{{ chapter.title }}</h3>
                    </div>

                    <div class="card-controls">
                        <button
                            class="card-btn"
                            @click="openChapter(chapter._id)"
                        >
                            Открыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <BackButton @click="goBack" />
</template>

<script setup>
const { useWebApp, BackButton } = await import('vue-tg');
const chapterStore = useChapterStore();
const { initDataUnsafe } = useWebApp();
const { currentTitleChapters, title } = storeToRefs(chapterStore);

const route = useRoute();
const titleId = route.params.titleId;

const openChapter = async chapterId => {
    await navigateTo(`/titles/${titleId}/chapters/${chapterId}`);
};

const goBack = async () => {
    await navigateTo('/dashboard');
};

onMounted(async () => {
    await chapterStore.fetchTitle(titleId, initDataUnsafe?.user?.id || 404);
});
</script>

<style scoped>
.card-body {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 10px 16px;
    gap: 10px;
}

h1 {
    color: #f1f1f1;
    font-weight: 500;
    font-size: 1.1rem;
}

.creation {
    margin-top: 12px;
}

.card-title {
    margin-top: 4px;
}

p {
    font-size: 0.8rem;
}

.card-controls {
    margin: 0;
}
</style>
