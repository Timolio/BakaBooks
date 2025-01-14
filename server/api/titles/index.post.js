import { Title } from '~/server/models/title.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const newTitle = new Title(body);

    await newTitle.save();

    return newTitle;
});
