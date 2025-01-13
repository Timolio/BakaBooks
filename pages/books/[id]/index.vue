<template>
    <div :class="{ hidden: !showUI }" class="reader-header">
        <div class="nav-reader">
            <div class="nav-reader__caption" v-if="book">
                <h2>{{ book.title }}</h2>
                <p>{{ book.description }}</p>
            </div>
        </div>
    </div>
    <div
        id="reader"
        v-if="book"
        @mousedown="onPageMouseDown($event)"
        @mouseup="onPageMouseUp($event)"
        @touchstart="onPageMouseDown($event)"
        @touchend="onPageMouseUp($event)"
    >
        <h2>{{ blockId }}</h2>
        <simplebar
            ref="feedContainer"
            data-simplebar-auto-hide="false"
            class="reader-container feed"
            v-if="mode === 'feed'"
            @scroll="onScroll"
        >
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
                <div
                    v-for="reaction in reactions[currentPage]"
                    v-if="currentPage === index + 1"
                    class="reaction-marker"
                    :style="{ top: `${reaction.y}px`, left: `${reaction.x}px` }"
                >
                    {{ reaction.type }}
                </div>
                <button
                    v-if="isOwner && route.hash === '#edit'"
                    class="delete-button"
                    @click.prevent="removeImage(index)"
                >
                    <BootstrapIcon name="trash-fill" />
                </button>
            </div>
        </simplebar>
        <simplebar
            class="reader-container render-item book"
            v-else-if="mode === 'book'"
        >
            <img
                v-if="currentBlock"
                :src="currentBlock.value"
                :id="currentPage"
            />
            <div
                v-for="reaction in reactions[String(currentPage)]"
                class="reaction-marker"
                :style="{ top: `${reaction.y}px`, left: `${reaction.x}px` }"
            >
                {{ reaction.type }}
            </div>
            <button
                v-if="isOwner && route.hash === '#edit'"
                class="delete-button"
                @click.prevent="removeImage(currentPage - 1)"
            >
                <BootstrapIcon name="trash-fill" />
            </button>
        </simplebar>

        <!-- Hidden file input -->
        <div
            v-if="showReactionPicker"
            class="reaction-picker"
            :style="{ top: `${pickerY}px`, left: `${pickerX}px` }"
        >
            <button
                v-for="emoji in emojis"
                :key="emoji"
                @click="addReaction(emoji)"
            >
                {{ emoji }}
            </button>
        </div>
        <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="onFileSelected"
            style="display: none"
        />
    </div>
    <ToolBar
        :class="{ hidden: !showUI }"
        :style="{ opacity: showUI ? 1 : 0 }"
        :tools="tools"
        style="transition: opacity 0.3s ease-in-out"
        :current="currentPage"
        :total="totalPages"
        @tool-click="handleToolClick"
    />
</template>

<script setup>
import { icon } from '@fortawesome/fontawesome-svg-core';
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

const { useWebApp } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();

const router = useRouter();
const mode = ref('feed');
const route = useRoute();
const bookId = route.params.id;
const bookStore = useBookStore();
const currentPage = ref(0);
const { book, isOwner } = storeToRefs(bookStore);
const fileInput = ref(null);
const feedContainer = ref(null);
const imageRefs = ref([]);
const showUI = ref(true);
const tools = ref([]);
const reactions = ref({});
const config = useRuntimeConfig().public;

const longPressTimeout = ref(null);
const pickerX = ref(0);
const pickerY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const showReactionPicker = ref(false);
const emojis = ref(['🔥', '😂', '😮', '😢', '❤️']);

const toggleUI = event => {
    showUI.value = !showUI.value;
};

const removeImage = index => {
    if (isOwner.value && route.hash === '#edit') {
        book.value.contentBlocks.splice(index, 1);
    }
};

const onPageClick = event => {
    const element = document.getElementById(`${currentPage.value}`);
    const rect = element.getBoundingClientRect();

    currentX.value = event.clientX - rect.left;
    currentY.value = event.clientY - rect.top;

    pickerX.value = event.clientX;
    pickerY.value = event.clientY;
    showReactionPicker.value = true;
};

const addReaction = async type => {
    const reaction = {
        bookId,
        blockId: blockId.value,
        type,
        x: currentX.value,
        y: currentY.value,
        authorId: initDataUnsafe?.user?.id || 404,
    };
    const data = await $fetch('/api/reactions', {
        method: 'POST',
        body: reaction,
    });
    reactions.value[currentPage.value].push(reaction);
};

const handleToolClick = tool => {
    switch (tool) {
        case 'image':
            imageHandler();
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
    }
};

const switchMode = newMode => {
    if (mode.value === newMode) return;
    mode.value = newMode;

    if (newMode === 'feed') {
        nextTick(() => scrollToPage(currentPage.value));
    }
};

const uploadImage = async file => {
    if (!file) return;

    const {
        body: { url, pub },
    } = await $fetch('/api/upload', {
        headers: {
            'Content-Type': file.type,
        },
    });

    await $fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });

    return pub;
};

const imageHandler = () => {
    fileInput.value.click();
};

const onFileSelected = async () => {
    const file = fileInput.value.files[0];
    if (file) {
        const imageUrl = await uploadImage(file);
        book.value.contentBlocks.push({
            type: 'image',
            value: imageUrl,
        });
    }
};

const onScroll = () => {
    if (!feedContainer.value) return;

    showUI.value = false;
    showReactionPicker.value = false;

    const scrollableElement = feedContainer.value.$el.querySelector(
        '.simplebar-content-wrapper'
    );
    const scrollTop = scrollableElement.scrollTop;
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
};

const scrollToPage = (pageNumber, smooth = false) => {
    if (pageNumber < 1 || pageNumber > totalPages.value) {
        return;
    }

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
    } else if (mode.value === 'book') {
        currentPage.value = pageNumber;
    }
};

const onPageMouseDown = async event => {
    longPressTimeout.value = setTimeout(() => {
        onPageClick(event);
    }, 600);
};

const onPageMouseUp = event => {
    clearTimeout(longPressTimeout.value);

    if (showReactionPicker.value) {
        return;
    }

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
};

onMounted(async () => {
    if (bookId === book.value?.id) return;

    await bookStore.fetchBook(bookId, initDataUnsafe?.user?.id || 404);

    currentPage.value = 1;
});

const totalPages = computed(() => {
    return book.value?.contentBlocks?.filter(block => block.type === 'image')
        .length;
});

const currentBlock = computed(() => {
    const imageBlocks = book.value.contentBlocks.filter(
        block => block.type === 'image'
    );
    return imageBlocks[currentPage.value - 1] || null;
});

const blockId = computed(
    () => book.value?.contentBlocks[currentPage.value - 1]?._id
);

watch(currentPage, async () => {
    if (reactions.value[currentPage.value]) return;
    const data = await $fetch(`/api/reactions/${bookId}/${blockId.value}`);
    reactions.value[currentPage.value] = data;
    console.log(reactions.value);
});

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
            isOwner.value && { name: 'edit', icon: 'pencil' },
        ].filter(Boolean); // Убираем null значения из массива
    }
});
</script>

<style scoped>
.reaction-picker {
    position: absolute;
    background: white;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.reaction-picker button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.reaction-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 20px;
    user-select: none;
    pointer-events: none;
    z-index: 2000;
}

#reader {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.reader-header {
    position: fixed;
    top: 0;
    left: 0;
    color: #f1f1f1;
    width: 100%;
    background-color: #111113;
    z-index: 1500;
    transition: transform 0.3s ease-in-out;
}

.reader-container.book {
    padding-top: 48px;
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

.nav-reader {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 48px;
}

.nav-reader__caption {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.nav-reader__caption p {
    font-weight: 400;
    margin-top: 2px;
    font-size: 0.75rem;
    line-height: 110%;
    color: #979798;
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
