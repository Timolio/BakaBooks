<template>
    <div id="dashboard" v-if="isOwner">
        <div class="header">
            <div class="section-title">
                <h1>Создание главы</h1>
            </div>
        </div>
        <Field v-model="titleName" label="Название главы" />
        <Field v-model="number" type="number" label="Номер главы" />
        <button @click="createChapter" class="create-btn">Создать главу</button>
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
