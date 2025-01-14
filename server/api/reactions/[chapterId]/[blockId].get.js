import { Reaction } from '~/server/models/reaction.model';

export default defineEventHandler(async event => {
    const chapterId = event.context.params.chapterId;
    const blockId = event.context.params.blockId;

    if (!chapterId || !blockId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const reactions = await Reaction.find({ chapterId, blockId });
        return reactions;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
