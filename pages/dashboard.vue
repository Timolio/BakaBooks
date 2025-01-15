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
.section-title {
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #3a995e;
    margin-left: 10px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.creation {
    margin-top: 12px;
}

.new-title-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #c4c4c5;
    height: 34px;
    width: auto;
    background-color: transparent;
    border: none;
    font-weight: 500;
    padding: 0 12px;
    border-radius: 8px;
    flex-shrink: 0;
    font-size: 0.9rem;
    gap: 6px;
    cursor: pointer;
    transition: background-color 0.4s, color 0.4s;
}

.new-title-btn:hover {
    background-color: #18181a;
    color: #fff;
}

.new-title-btn .icon {
    font-size: 1.4rem;
}

h1 {
    color: #f1f1f1;
    font-weight: 700;
    font-size: 1.2rem;
}
</style>
