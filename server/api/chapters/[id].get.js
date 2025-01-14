import { Book } from '~/server/models/book.model';

export default defineEventHandler(async event => {
    const bookId = event.context.params.id;

    if (!bookId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const book = await Book.findById(bookId);
        return book;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
