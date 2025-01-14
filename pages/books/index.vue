<template>
    <div id="dashboard">
        <h1>Ваши книги</h1>
        <div v-if="books?.length === 0">
            <p>У вас пока нет книг. Создайте первую книгу!</p>
        </div>
        <div class="main-section">
            <div v-for="book in books" class="card">
                <div class="card-body">
                    <h3 class="card-title">{{ book.title }}</h3>
                    <div class="card-controls">
                        <button @click="openBook(book._id)">Открыть</button>
                        <button @click="deleteBook(book._id)">Удалить</button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h2>Создать новую книгу</h2>
            <input type="text" v-model="title" />
            <button @click="createBook">Создать книгу</button>
            <button @click="inviteBot">Создать команду</button>
        </div>
    </div>
</template>

<script setup>
const { useWebApp, useWebAppNavigation } = await import('vue-tg');
const bookStore = useBookStore();
const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();
const { books } = storeToRefs(bookStore);

const title = ref('');
const config = useRuntimeConfig();

const openBook = async bookId => {
    await navigateTo(`/books/${bookId}`);
};

const deleteBook = async bookId => {
    await bookStore.deleteBook(bookId, initDataUnsafe?.user?.id || 404);
};

const inviteBot = () => {
    const rights = 'invite_users,manage_chat';
    const inviteLink = `https://t.me/${config.public.BOT_ID}?startchannel&admin=${rights}`;
    openTelegramLink(inviteLink);
};

const createBook = async () => {
    const bookId = await bookStore.createBook({
        title: title.value,
        authorId: initDataUnsafe?.user?.id || 404,
    });
    await navigateTo(`/books/${bookId}`);
};

onMounted(async () => {
    await bookStore.fetchBooks(initDataUnsafe?.user?.id || 404);
});
</script>

<style scoped>
#dashboard {
    overflow: auto;
    padding: 0 20px;
    height: 100vh;
}

.main-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card {
    position: relative;
    background-color: #18181a;
    border-radius: 10px;
    word-wrap: break-word;
}

.card-body {
    flex: auto;
    padding: 16px 10px 16px 16px;
    display: flex;
    flex-direction: column;
}

.card-title {
    color: #f1f1f1;
    overflow: hidden;
    font-weight: 500;
    line-height: 133%;
}
</style>
