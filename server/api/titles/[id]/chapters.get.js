import { Book } from '~/server/models/book.model';

export default defineEventHandler(async event => {
    const titleId = event.context.params.id;

    if (!titleId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const books = await Book.find(
            { titleId },
            { _id: true, title: true, order: true }
        );
        console.log(books);
        return books;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
