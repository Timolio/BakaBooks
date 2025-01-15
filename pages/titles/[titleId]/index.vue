<template>
    <div id="dashboard">
        <div class="header" v-if="title">
            <div class="section-title">
                <h1>{{ title.name }}</h1>
            </div>
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
        <div class="creation" v-if="isOwner">
            <h2>Создать главу</h2>
            <input type="text" v-model="titleName" />
            <input type="number" v-model="number" />
            <button @click="createChapter">Создать главу</button>
        </div>
    </div>
    <BackButton @click="goBack" />
</template>

<script setup>
const { useWebApp, BackButton } = await import('vue-tg');
const chapterStore = useChapterStore();
const { initDataUnsafe } = useWebApp();
const { currentTitleChapters, title, isOwner } = storeToRefs(chapterStore);

const route = useRoute();
const titleId = route.params.titleId;

const titleName = ref('');
const number = ref(0);

const createChapter = async () => {
    const chapterId = await chapterStore.createChapter({
        title: titleName.value,
        titleId,
        order: number.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/titles/${titleId}/chapters/${chapterId}`);
};

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
