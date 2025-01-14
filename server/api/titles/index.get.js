import { Title } from '~/server/models/title.model';

export default defineEventHandler(async event => {
    const userId = Number(getHeader(event, 'x-user-id'));

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        const titles = await Title.find(
            { authorId: userId },
            { _id: true, name: true }
        );
        console.log(titles);
        return titles;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});
