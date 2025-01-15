<template>
    <div class="creation" v-if="isOwner">
        <h2>Создать главу</h2>
        <input type="text" v-model="titleName" />
        <input type="number" v-model="number" />
        <button @click="createChapter">Создать главу</button>
    </div>
    <BackButton @click="goBack" />
</template>

<script setup>
const { useWebApp, BackButton } = await import('vue-tg');
const chapterStore = useChapterStore();
const { isOwner } = storeToRefs(chapterStore);
const { initDataUnsafe } = useWebApp();
const titleName = ref('');
const number = ref(0);

const route = useRoute();
const titleId = route.params.titleId;

const goBack = async () => {
    await navigateTo(`/titles/${titleId}`);
};

const createChapter = async () => {
    const chapterId = await chapterStore.createChapter({
        title: titleName.value,
        titleId,
        order: number.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/titles/${titleId}/chapters/${chapterId}`);
};
</script>
