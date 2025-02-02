<template>
    <!-- Шапка -->
    <ReaderHeader
        @to-title="goToTitle"
        :title="title"
        :book="currentChapter"
        :showUI="showUI"
    />
    <Loading :show="currentChapter?.contentBlocks === undefined || uploading" />
    <div
        id="reader"
        v-if="currentIndex !== -1"
        @click="onPageClick($event)"
        class="reader-wrapper"
    >
        <!-- Режим "лента" (feed) -->
        <simplebar
            ref="feedContainer"
            data-simplebar-auto-hide="false"
            class="reader-container"
            @scroll="onScroll"
        >
            <div
                class="feed"
                v-if="mode === 'feed' && currentChapter?.contentBlocks"
            >
                <div
                    class="render-item"
                    v-for="(block, index) in currentChapter?.contentBlocks"
                    :ref="el => (imageRefs[index] = el)"
                >
                    <img
                        v-if="block.type === 'image'"
                        :src="block.value"
                        :id="index + 1"
                        loading="lazy"
                        decoding="async"
                    />
                    <button
                        v-if="isOwner && route.hash === '#edit'"
                        class="delete-button"
                        @click.prevent="removeImage(index)"
                    >
                        <BootstrapIcon name="trash-fill" />
                    </button>
                </div>
            </div>
            <div
                class="book"
                v-else-if="mode === 'book' && currentChapter?.contentBlocks"
                ref="currentImageRef"
            >
                <img
                    v-if="currentBlock"
                    :src="currentBlock.value"
                    :id="currentPage"
                    loading="lazy"
                    decoding="async"
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
    </div>

    <ReaderSidebar
        :show="showSidebar"
        @close="showSidebar = false"
        @tool-click="handleToolClick"
    />
    <ReaderToolbar
        :show="showUI"
        :tools="tools"
        :current="currentPage"
        :total="totalPages"
        :disabled="currentChapter?.contentBlocks === undefined || uploading"
        @tool-click="handleToolClick"
    />
    <ImageUploader
        ref="imageUploader"
        @uploaded="upload"
        @uploading="uploading = true"
    />
</template>

<script setup>
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

import { Buffer } from 'buffer';

const { useWebApp } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig().public;

const mode = ref('feed');
const chapterId = route.params.chapterId;
const titleId = route.params.titleId;

const chapterStore = useChapterStore();
const { isOwner, title, currentTitleChapters, currentIndex, currentChapter } =
    storeToRefs(chapterStore);

const currentPage = ref(0);
const imageRefs = ref([]);
const currentImageRef = ref(null);
const feedContainer = ref(null);

const showUI = ref(true);
const fullScreen = ref(false);
const showSidebar = ref(false);

const tools = ref([]);

const imageUploader = ref(null);
const uploading = ref(false);

const upload = imageUrl => {
    if (imageUrl) {
        const length = currentChapter.value?.contentBlocks.push({
            type: 'image',
            value: imageUrl,
        });
        scrollToPage(length - 1, true);
    }
    uploading.value = false;
};

onMounted(async () => {
    // if (window.Adsgram) {
    //     const AdController = window.Adsgram.init({
    //         blockId: 'int-7194',
    //     });
    //     AdController.show();
    // }
    await chapterStore.fetchTitle(titleId, initDataUnsafe?.user?.id || 404);
    await chapterStore.fetchFullChapter(chapterId);
    currentPage.value = 1;
});

const goToTitle = async () => {
    await navigateTo(`/titles/${title.value._id}`);
};

const totalPages = computed(() => {
    return (
        currentChapter.value?.contentBlocks?.filter(b => b.type === 'image')
            .length || 0
    );
});

const currentBlock = computed(() => {
    const imageBlocks =
        currentChapter.value?.contentBlocks?.filter(b => b.type === 'image') ||
        [];
    return imageBlocks[currentPage.value - 1] || null;
});

const blockId = computed(() => {
    return currentBlock.value?._id || null;
});

watch(currentPage, async newVal => {
    await setActiveBlock(currentPage.value - 1);
});

/* -----------------------------
     Скрыть/показать UI
----------------------------- */
function toggleUI() {
    showUI.value = !showUI.value;
}

/* -----------------------------
     Логика листания/тапов
----------------------------- */
function onPageClick(event) {
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

/* -----------------------------
     Скролл в режиме «лента»
----------------------------- */
function onScroll() {
    if (mode.value === 'book') return;
    if (!feedContainer.value) return;

    showUI.value = false;

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
            const scrollableElement = feedContainer.value?.$el.querySelector(
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
            {
                name: 'prev',
                icon: 'chevron-left',
                disabled: currentIndex.value === 0,
            },
            { name: 'settings', icon: 'gear' },
            isOwner.value && { name: 'edit', icon: 'pencil' },
            {
                name: 'next',
                icon: 'chevron-right',
                disabled:
                    currentIndex.value ===
                    currentTitleChapters.value?.length - 1,
            },
        ].filter(Boolean);
    }
});

const moveChapter = async direction => {
    const currentIndex = currentTitleChapters.value?.findIndex(
        b => b._id === currentChapter.value?._id
    );
    if (currentIndex === -1) return;

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < currentTitleChapters.value?.length) {
        const nextBook = currentTitleChapters.value[newIndex];
        await navigateTo(`/titles/${title.value._id}/chapters/${nextBook._id}`);
    }
};

const handleToolClick = async tool => {
    switch (tool) {
        case 'settings':
            showSidebar.value = !showSidebar.value;
            break;
        case 'image':
            imageUploader.value.trigger();
            break;
        case 'prev':
            await moveChapter('prev');
            break;
        case 'next':
            await moveChapter('next');
            break;
        case 'feed':
            switchMode('feed');
            break;
        case 'book':
            switchMode('book');
            break;
        case 'save':
            await chapterStore.saveChapter();
            break;
        case 'edit':
            router.push({ path: route.path, hash: '#edit' });
            break;
        case 'view':
            router.push({ path: route.path, hash: '' });
            break;
        case 'link':
            const jsonString = JSON.stringify({
                titleId: title.value._id,
                chapterId: currentChapter.value?._id,
            });
            const encoded = Buffer.from(jsonString).toString('base64');
            const link = `https://t.me/${config.BOT_ID}/start?startapp=${encoded}`;
            navigator.clipboard.writeText(link);
            break;
        case 'fullscreen':
            const el = document.documentElement;
            if (fullScreen.value) {
                fullScreen.value = false;
                if (initDataUnsafe?.user?.id) {
                    window?.Telegram?.WebApp?.exitFullscreen();
                    break;
                }
                document.exitFullscreen();
                break;
            } else {
                fullScreen.value = true;
                if (initDataUnsafe?.user?.id) {
                    window?.Telegram?.WebApp?.requestFullscreen();
                    break;
                }
                el.requestFullscreen();
                break;
            }
    }
};

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
        currentChapter.value?.contentBlocks.splice(index, 1);
    }
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
    pointer-events: auto;
}
</style>
