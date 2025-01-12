export const useBookStore = defineStore('book', {
    state: () => ({
        book: null,
        isOwner: false,
    }),
    actions: {
        async fetchBook(bookId, userId) {
            try {
                const data = await $fetch(`/api/books/${bookId}`, {
                    headers: {
                        'x-user-id': userId,
                    },
                });
                this.book = data.book;
                this.isOwner = data.isOwner;
            } catch (error) {
                showError(error);
            }
        },
        async createBook(book) {
            const { body } = await $fetch('/api/books', {
                method: 'POST',
                body: book,
            });
            this.book = body;
            return body._id;
        },
        async saveBook() {
            await $fetch(`/api/books/${this.book._id}`, {
                method: 'PUT',
                body: this.book,
            });
        },
    },
});
