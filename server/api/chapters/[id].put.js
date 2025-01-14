import { Book } from '~/server/models/book.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    try {
        await Book.findByIdAndUpdate(event.context.params.id, body);
        return {
            statusCode: 200,
            body,
        };
    } catch (error) {
        return {
            statusCode: 404,
            body: {
                message: 'Book not found',
            },
        };
    }
});
