import { Chapter } from '~/server/models/chapter.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const newChapter = new Chapter(body);

    await newChapter.save();

    return {
        statusCode: 201,
        body: newChapter,
    };
});
