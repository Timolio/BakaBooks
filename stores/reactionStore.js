export const useReactionStore = defineStore('reactionStore', {
    state: () => ({
        reactionsMap: {},
        currentIndex: -1,
    }),
    actions: {
        hasReactions(blockId) {
            return !!this.reactionsMap[blockId];
        },

        async fetchReactions(bookId, blockId) {
            if (!blockId || this.hasReactions(blockId)) return;

            const data = await $fetch(`/api/reactions/${bookId}/${blockId}`);
            if (data) {
                this.reactionsMap[blockId] = data;
            } else {
                this.reactionsMap[blockId] = [];
            }
        },

        async addReaction(reaction) {
            const created = await $fetch('/api/reactions', {
                method: 'POST',
                body: reaction,
            });

            if (!this.reactionsMap[reaction.blockId]) {
                this.reactionsMap[reaction.blockId] = [];
            }

            this.reactionsMap[reaction.blockId].push(created);
            return created;
        },
    },
});
