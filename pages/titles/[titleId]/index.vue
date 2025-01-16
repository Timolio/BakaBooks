<template>
    <div id="dashboard">
        <Loading :show="title === null && currentTitleChapters === null" />
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
        <div class="main-section" v-if="currentTitleChapters">
            <div
                v-for="chapter in currentTitleChapters"
                class="card"
                @click="openChapter(chapter._id)"
            >
                <div class="card-body">
                    <div class="card-info">
                        <p>{{ chapter.order }}</p>
                        <h3 class="card-title">{{ chapter.title }}</h3>
                    </div>

                    <div class="card-info">
                        <p>{{ chapter.createdAt.split('T')[0] }}</p>
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
    console.log(currentTitleChapters.value);
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

.card {
    cursor: pointer;
}

.card-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

h1 {
    color: #f1f1f1;
    font-weight: 500;
    font-size: 1.1rem;
}

h3 {
    margin-top: 0 !important;
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
