<template>
    <div id="dashboard">
        <div class="header">
            <div class="section-title">
                <h1>Создание тайтла</h1>
            </div>
        </div>
        <Field v-model="title" label="Название тайтла" />
        <Dropdown :options="dropdownOptions" v-model="selectedValue" />
        <button @click="createTitle" class="card-btn">Создать тайтл</button>
    </div>
    <BackButton @click="goBack" />
</template>

<script setup>
const { useWebApp, BackButton } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();

const chapterStore = useChapterStore();
const selectedValue = ref(null);
const dropdownOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
];

const title = ref('');

const goBack = async () => {
    await navigateTo('/dashboard');
};

const createTitle = async () => {
    const titleId = await chapterStore.createTitle({
        name: title.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/titles/${titleId}`);
};
</script>

<style scoped>
.field-label {
    font-weight: 400;
    color: #c4c4c5;
    font-size: 0.9rem;
    padding-bottom: 6px;
}

.field {
    display: flex;
    flex-direction: column;
}

.field-wrap {
    height: 40px;
    padding: 0 10px;
    background-color: #1c1c1e;
    border-radius: 8px;
    border: 1px solid transparent;
}

.field-wrap input {
    width: 100%;
    height: 100%;
    padding: 10px 0;
    border: none;
    font-weight: 400;
    background-color: transparent;
    outline: none;
}
</style>
