export const useBookStore = defineStore('book', {
    state: () => ({
        book: null,
        books: [],
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
        async deleteBook(bookId, userId) {
            try {
                await $fetch(`/api/books/${bookId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-user-id': userId,
                    },
                });
                this.books = this.books.filter(book => book._id !== bookId);
            } catch (error) {
                showError(error);
            }
        },
        async fetchBooks(userId) {
            try {
                const data = await $fetch(`/api/books`, {
                    headers: {
                        'x-user-id': userId,
                    },
                });
                this.books = data;
            } catch (error) {
                showError(error);
            }
        },
    },
});
