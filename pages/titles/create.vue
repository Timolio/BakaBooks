<template>
    <div id="dashboard">
        <div class="header">
            <div class="section-title">
                <h1>Создание тайтла</h1>
            </div>
        </div>
        <Field v-model="title" label="Название тайтла" />
        <Dropdown
            :options="user?.channels"
            v-model="selectedValue"
            label-property="title"
            value-property="_id"
            label="Опубликовать от лица"
        />
        <div class="field">
            <h2>Создать команду</h2>
            <button @click="inviteBot">Создать команду</button>
        </div>
        <button @click="createTitle" class="create-btn">Создать тайтл</button>
    </div>
    <BackButton @click="goBack" />
</template>

<script setup>
const { useWebApp, BackButton, useWebAppNavigation } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();

const chapterStore = useChapterStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const selectedValue = ref(null);

const config = useRuntimeConfig();

const title = ref('');

const goBack = async () => {
    await navigateTo('/dashboard');
};

const inviteBot = () => {
    const rights = 'invite_users+manage_chat';
    const inviteLink = `https://t.me/${config.public.BOT_ID}?startchannel&admin=${rights}`;
    openTelegramLink(inviteLink);
};

const createTitle = async () => {
    const titleId = await chapterStore.createTitle({
        name: title.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/titles/${titleId}`);
};

onMounted(async () => {
    await userStore.fetchUser(initDataUnsafe?.user?.id || 898654264);
});
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
