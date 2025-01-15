export const useChapterStore = defineStore('chapter', {
    state: () => ({
        title: null,
        titles: null,
        isOwner: false,
        currentTitleChapters: null,
        currentIndex: -1,
    }),
    getters: {
        currentChapter: state => {
            if (state.currentIndex <= -1) return;
            return state.currentTitleChapters[state.currentIndex];
        },
    },
    actions: {
        async fetchFullChapter(chapterId, userId) {
            this.currentIndex = this.currentTitleChapters.findIndex(
                chapter => chapter._id === chapterId
            );
            if (
                this.currentIndex === -1 ||
                this.currentTitleChapters[this.currentIndex].contentBlocks
            )
                return;
            const data = await $fetch(`/api/chapters/${chapterId}`, {
                headers: {
                    'x-user-id': userId,
                },
            });
            this.currentTitleChapters[this.currentIndex] = data;
        },
        async fetchTitle(titleId, userId) {
            if (this.title?._id === titleId) return;

            try {
                const data = await $fetch(`/api/titles/${titleId}`, {
                    headers: {
                        'x-user-id': userId,
                    },
                });
                this.title = data.title;
                this.isOwner = data.isOwner;

                const chapters = await $fetch(
                    `/api/titles/${titleId}/chapters`
                );
                this.currentTitleChapters = chapters.sort(
                    (a, b) => a.order - b.order
                );
            } catch (error) {
                showError(error);
            }
        },
        async createChapter(chapter) {
            const { body } = await $fetch('/api/chapters', {
                method: 'POST',
                body: chapter,
            });
            this.currentTitleChapters.push(body);
            this.currentTitleChapters = this.currentTitleChapters.sort(
                (a, b) => a.order - b.order
            );
            return body._id;
        },
        async createTitle(title) {
            const data = await $fetch('/api/titles', {
                method: 'POST',
                body: title,
            });
            return data._id;
        },
        async saveChapter() {
            await $fetch(`/api/chapters/${this.currentChapter._id}`, {
                method: 'PUT',
                body: this.currentChapter,
            });
        },
        async fetchTitles(userId) {
            try {
                const data = await $fetch(`/api/titles`, {
                    method: 'GET',
                    headers: {
                        'x-user-id': userId,
                    },
                });
                this.titles = data;
            } catch (error) {
                showError(error);
            }
        },
    },
});
