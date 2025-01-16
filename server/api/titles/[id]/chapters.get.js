import { Chapter } from '~/server/models/chapter.model';

export default defineEventHandler(async event => {
    const titleId = event.context.params.id;

    if (!titleId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const chapters = await Chapter.find(
            { titleId },
            { _id: true, title: true, order: true, createdAt: true }
        );
        return chapters;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
