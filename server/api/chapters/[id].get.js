import { Chapter } from '~/server/models/chapter.model';

export default defineEventHandler(async event => {
    const chapterId = event.context.params.id;

    if (!chapterId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const chapter = await Chapter.findById(chapterId);
        return chapter;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
