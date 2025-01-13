import { Reaction } from '~/server/models/reaction.model';

export default defineEventHandler(async event => {
    const bookId = event.context.params.bookId;
    const blockId = event.context.params.blockId;

    if (!bookId || !blockId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const reactions = await Reaction.find({ bookId, blockId });
        return reactions;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
