import { Chapter } from '~/server/models/chapter.model';

export default defineEventHandler(async event => {
    const chapterId = event.context.params.id;
    const userId = Number(getHeader(event, 'x-user-id'));

    if (!userId || !chapterId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    const chapter = await Chapter.findById(chapterId);
    if (chapter.authorId !== userId) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }

    try {
        await Chapter.findByIdAndDelete(chapterId);
        return true;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
