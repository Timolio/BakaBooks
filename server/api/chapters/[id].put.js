import { Chapter } from '~/server/models/chapter.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    try {
        await Chapter.findByIdAndUpdate(event.context.params.id, body);
        return {
            statusCode: 200,
            body,
        };
    } catch (error) {
        return {
            statusCode: 404,
            body: {
                message: 'Chapter not found',
            },
        };
    }
});
