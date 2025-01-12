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

    try {
        const book = await Book.findById(bookId);
        return {
            book,
            isOwner: book.authorId === userId,
        };
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
