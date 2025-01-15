<template>
    <div id="dashboard">
        <div class="header">
            <div class="section-title">
                <h1>Ваши тайтлы</h1>
            </div>
            <button @click="navigateTo('/titles/create')" class="new-title-btn">
                <span>Создать тайтл</span>
                <BootstrapIcon class="icon" name="plus" />
            </button>
        </div>

        <div class="main-section">
            <div class="list-items" v-if="titles.length > 0">
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
            <div v-else class="list-message">
                <div class="list-icon">
                    <img src="/img/nothing-icon.png" />
                </div>
                <p>Кажется, здесь пока пусто...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const { useWebApp } = await import('vue-tg');
const chapterStore = useChapterStore();
const { initDataUnsafe } = useWebApp();

const { titles } = storeToRefs(chapterStore);

const openTitle = async titleId => {
    await navigateTo(`/titles/${titleId}`);
};

onMounted(async () => {
    await chapterStore.fetchTitles(initDataUnsafe?.user?.id || 404);
});
</script>

<style>
h1 {
    color: #f1f1f1;
    font-weight: 700;
    font-size: 1.2rem;
}
</style>
