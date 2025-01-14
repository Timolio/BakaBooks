import { Title } from '~/server/models/title.model';

export default defineEventHandler(async event => {
    const titleId = event.context.params.id;
    const userId = Number(getHeader(event, 'x-user-id'));

    if (!titleId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const title = await Title.findById(titleId);
        return {
            title,
            isOwner: title.authorId === userId,
        };
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
