import { Book } from '~/server/models/book.model';

export default defineEventHandler(async event => {
    const userId = Number(getHeader(event, 'x-user-id'));

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const books = await Book.find({ authorId: userId });
        console.log(books);
        return books;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
