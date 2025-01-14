import { Book } from '~/server/models/book.model';

export default defineEventHandler(async event => {
    const bookId = event.context.params.id;
    const userId = Number(getHeader(event, 'x-user-id'));

    if (!userId || !bookId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    const book = await Book.findById(bookId);
    if (book.authorId !== userId) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }

    try {
        await Book.findByIdAndDelete(bookId);
        return true;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
