<template>
    <!-- Шапка -->
    <ReaderHeader :book="book" :showUI="showUI" />
    <div
        id="reader"
        v-if="book"
        @mousedown="onPageMouseDown($event)"
        @mouseup="onPageMouseUp($event)"
        @touchstart="onPageMouseDown($event)"
        @touchend="onPageMouseUp($event)"
        class="reader-wrapper"
    >
        <!-- Режим "лента" (feed) -->
        <simplebar
            ref="feedContainer"
            data-simplebar-auto-hide="false"
            class="reader-container"
            @scroll="onScroll"
        >
            <ReactionOverlay
                :show="showReactionOverlay"
                :active-block-rect="activeBlockRect"
            />
            <div class="feed" v-if="mode === 'feed'">
                <div
                    class="render-item"
                    v-for="(block, index) in book.contentBlocks"
                    :ref="el => (imageRefs[index] = el)"
                >
                    <img
                        v-if="block.type === 'image'"
                        :src="block.value"
                        :id="index + 1"
                    />
                    <!-- <ReactionMarker
                        v-for="(reaction, rIndex) in getReactionsForBlock(
                            block._id
                        )"
                        :key="rIndex"
                        :reaction="reaction"
                        :imageWidth="getImageWidth(index + 1)"
                        :imageHeight="getImageHeight(index + 1)"
                    /> -->
                    <button
                        v-if="isOwner && route.hash === '#edit'"
                        class="delete-button"
                        @click.prevent="removeImage(index)"
                    >
                        <BootstrapIcon name="trash-fill" />
                    </button>
                </div>
            </div>
            <div class="book" v-else-if="mode === 'book'" ref="currentImageRef">
                <img
                    v-if="currentBlock"
                    :src="currentBlock.value"
                    :id="currentPage"
                />
                <button
                    v-if="isOwner && route.hash === '#edit'"
                    class="delete-button"
                    @click.prevent="removeImage(currentPage - 1)"
                >
                    <BootstrapIcon name="trash-fill" />
                </button>
            </div>
        </simplebar>

        <!-- Пикер реакций -->
        <ReactionPicker
            :show="showReactionPicker"
            :pickerX="pickerX"
            :pickerY="pickerY"
            :emojis="emojis"
            @pick="onEmojiPick"
        />

        <!-- Hidden file input -->
        <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="onFileSelected"
            style="display: none"
        />
    </div>
    <ReaderToolbar
        :show="showUI"
        :tools="tools"
        style="transition: opacity 0.3s ease-in-out"
        :current="currentPage"
        :total="totalPages"
        @tool-click="handleToolClick"
    />
</template>

<script setup>
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

const { useWebAppViewport, useWebAppTheme, useWebApp } = await import('vue-tg');
const { disableVerticalSwipes, expand } = useWebAppViewport();
const { setHeaderColor, setBackgroundColor } = useWebAppTheme();
const { initDataUnsafe } = useWebApp();

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig().public;

const mode = ref('feed');
const bookId = route.params.id;

const bookStore = useBookStore();
const { book, isOwner } = storeToRefs(bookStore);

const reactionStore = useReactionStore();
const { reactionsMap } = storeToRefs(reactionStore);

const currentPage = ref(0);
const imageRefs = ref([]);
const currentImageRef = ref(null);
const feedContainer = ref(null);

const showUI = ref(true);
const showReactionPicker = ref(false);
const showReactionOverlay = ref(false);

const activeBlockRect = ref({ x: 0, y: 0, width: 0, height: 0 });

const pickerX = ref(0);
const pickerY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const emojis = ref(['🔥', '😂', '😮', '😢', '❤️']);

const tools = ref([]);

const longPressTimeout = ref(null);

const fileInput = ref(null);

setBackgroundColor('#111113');
setHeaderColor('#111113');
expand();
disableVerticalSwipes();

const getTop = el =>
    el.offsetTop + (el.offsetParent && getTop(el.offsetParent));

const setActiveBlock = async index => {
    const block = book.value.contentBlocks[index];
    if (!reactionsMap.value[block._id])
        await reactionStore.fetchReactions(bookId, block._id);

    let el;
    if (mode.value === 'feed') {
        el = imageRefs.value[index];
    } else {
        el = currentImageRef.value;
    }

    if (!el) return;
    await nextTick(() => {
        activeBlockRect.value = {
            reactions: reactionsMap.value[block._id],
            x: el.offsetLeft,
            y: getTop(el),
            width: el.scrollWidth,
            height: el.scrollHeight,
        };
    });
};

onMounted(async () => {
    if (bookId !== book.value?.id) {
        await bookStore.fetchBook(bookId, initDataUnsafe?.user?.id || 404);
    }
    currentPage.value = 1;
});

const totalPages = computed(() => {
    return (
        book.value?.contentBlocks?.filter(b => b.type === 'image').length || 0
    );
});

const currentBlock = computed(() => {
    const imageBlocks =
        book.value?.contentBlocks?.filter(b => b.type === 'image') || [];
    return imageBlocks[currentPage.value - 1] || null;
});

const blockId = computed(() => {
    return currentBlock.value?._id || null;
});

watch(currentPage, async newVal => {
    await setActiveBlock(currentPage.value - 1);
});

/* -----------------------------
     Обработка добавления реакций
----------------------------- */
async function onEmojiPick(emoji) {
    if (!blockId.value) return;

    const reaction = {
        bookId,
        blockId: blockId.value,
        type: emoji,
        x: currentX.value,
        y: currentY.value,
        authorId: initDataUnsafe?.user?.id || 404,
    };
    await reactionStore.addReaction(reaction);

    showReactionPicker.value = false;
}

/* -----------------------------
     Скрыть/показать UI
----------------------------- */
function toggleUI() {
    showUI.value = !showUI.value;
}

/* -----------------------------
     Логика листания/тапов
----------------------------- */
function onPageMouseDown(event) {
    longPressTimeout.value = setTimeout(() => {
        onLongPress(event);
    }, 600);
}
function onPageMouseUp(event) {
    clearTimeout(longPressTimeout.value);

    if (showReactionPicker.value) return;

    const screenWidth = window.innerWidth;
    const thirdWidth = screenWidth / 3;

    if (event.clientX < thirdWidth && currentPage.value > 1) {
        scrollToPage(currentPage.value - 1, true);
    } else if (event.clientX >= thirdWidth && event.clientX <= 2 * thirdWidth) {
        toggleUI();
    } else if (
        event.clientX > 2 * thirdWidth &&
        currentPage.value < totalPages.value
    ) {
        scrollToPage(currentPage.value + 1, true);
    }
}

function onLongPress(event) {
    let clientX, clientY;
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    const el = document.getElementById(`${currentPage.value}`);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    currentX.value = ((clientX - rect.left) / rect.width) * 100;
    currentY.value = ((clientY - rect.top) / rect.height) * 100;

    pickerX.value = clientX;
    pickerY.value = clientY;
    showReactionPicker.value = true;
}

/* -----------------------------
     Скролл в режиме «лента»
----------------------------- */
function onScroll() {
    if (mode.value === 'book') return;
    if (!feedContainer.value) return;

    showUI.value = false;
    showReactionPicker.value = false;

    const scrollableElement = feedContainer.value.$el.querySelector(
        '.simplebar-content-wrapper'
    );
    const scrollTop = scrollableElement.scrollTop;
    const clientHeight = scrollableElement.clientHeight;
    const scrollHeight = scrollableElement.scrollHeight;

    let closestIndex = 0;
    let closestDistance = Infinity;

    imageRefs.value.forEach((el, index) => {
        if (el) {
            const distance = Math.abs(el.offsetTop - scrollTop);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        }
    });

    currentPage.value = closestIndex + 1;

    const THRESHOLD = 10;
    if (scrollTop + clientHeight >= scrollHeight - THRESHOLD) {
        currentPage.value = totalPages.value;
    }
}

/* -----------------------------
     Скролл к нужной странице
----------------------------- */
function scrollToPage(pageNumber, smooth = false) {
    if (pageNumber < 1 || pageNumber > totalPages.value) return;

    if (mode.value === 'feed') {
        const targetElement = imageRefs.value[pageNumber - 1];
        if (targetElement && feedContainer.value) {
            const scrollableElement = feedContainer.value.$el.querySelector(
                '.simplebar-content-wrapper'
            );
            scrollableElement.scrollTo({
                top: targetElement.offsetTop,
                behavior: smooth ? 'smooth' : 'auto',
            });
        }
    } else {
        currentPage.value = pageNumber;
    }
}

/* -----------------------------
     Логика тулбара
----------------------------- */
watchEffect(() => {
    if (isOwner.value && route.hash === '#edit') {
        tools.value = [
            { name: 'link', icon: 'link-45deg' },
            { name: 'image', icon: 'image' },
            { name: 'save', icon: 'floppy' },
            { name: 'view', icon: 'eye' },
        ];
    } else {
        tools.value = [
            { name: 'feed', icon: 'view-list' },
            { name: 'book', icon: 'book' },
            { name: 'chat', icon: 'chat-heart' },
            isOwner.value && { name: 'edit', icon: 'pencil' },
        ].filter(Boolean);
    }
});

function handleToolClick(tool) {
    switch (tool) {
        case 'image':
            fileInput.value.click();
            break;
        case 'feed':
            switchMode('feed');
            break;
        case 'book':
            switchMode('book');
            break;
        case 'save':
            bookStore.saveBook();
            break;
        case 'edit':
            router.push({ path: route.path, hash: '#edit' });
            break;
        case 'view':
            router.push({ path: route.path, hash: '' });
            break;
        case 'link':
            const link = `https://t.me/${config.BOT_ID}/start?startapp=${bookId}`;
            navigator.clipboard.writeText(link);
            break;
        case 'chat':
            showReactionOverlay.value = !showReactionOverlay.value;
            break;
    }
}

function switchMode(newMode) {
    if (mode.value === newMode) return;
    mode.value = newMode;

    if (newMode === 'feed') {
        nextTick(() => scrollToPage(currentPage.value));
    }
}

/* -----------------------------
     Работа с изображениями (добавление/удаление)
----------------------------- */
function removeImage(index) {
    if (isOwner.value && route.hash === '#edit') {
        book.value.contentBlocks.splice(index, 1);
    }
}

function onFileSelected() {
    const file = fileInput.value.files[0];
    if (file) {
        uploadImage(file).then(imageUrl => {
            if (imageUrl) {
                book.value.contentBlocks.push({
                    type: 'image',
                    value: imageUrl,
                });
            }
        });
    }
}

async function uploadImage(file) {
    if (!file) return null;
    // запрашиваем url для заливки
    const { body } = await $fetch('/api/upload', {
        headers: { 'Content-Type': file.type },
    });
    const { url, pub } = body;

    await $fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });
    return pub;
}
</script>

<style scoped>
#reader {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.render-item {
    position: relative;
}

.delete-button {
    z-index: 1100;
    position: absolute;
    top: 50%;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: brown;
}

.reader-container {
    height: 100vh;
}

.reader-header.hidden {
    transform: translateY(-100%);
}

.reader-container {
    max-width: 720px;
    width: 100%;
}

img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    user-select: none;
    pointer-events: none;
}
</style>
