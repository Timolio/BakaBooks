<template>
    <div id="dashboard">
        <div class="main-section">
            <div v-for="chapter in currentTitleChapters" class="card">
                <div class="card-body">
                    <h3 class="card-title">{{ chapter.title }}</h3>
                    <p>{{ chapter.order }}</p>
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
        <div>
            <h2>Создать главу</h2>
            <input type="text" v-model="title" />
            <input type="number" v-model="number" />
            <button @click="createChapter">Создать главу</button>
        </div>
    </div>
</template>

<script setup>
const { useWebApp } = await import('vue-tg');
const chapterStore = useChapterStore();
const { initDataUnsafe } = useWebApp();
const { currentTitleChapters } = storeToRefs(chapterStore);

const route = useRoute();
const titleId = route.params.titleId;

const title = ref('');
const number = ref(0);

const createChapter = async () => {
    const chapterId = await chapterStore.createChapter({
        title: title.value,
        titleId,
        order: number.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/titles/${titleId}/chapters/${chapterId}`);
};

const openChapter = async chapterId => {
    await navigateTo(`/titles/${titleId}/chapters/${chapterId}`);
};

onMounted(async () => {
    await chapterStore.fetchTitle(titleId, initDataUnsafe?.user?.id || 404);
});
</script>
