import { Book } from '~/server/models/book.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const { title, authorId } = body;

    const newBook = new Book({
        title,
        description: '',
        authorId,
        contentBlocks: [],
    });

    await newBook.save();

    return {
        statusCode: 201,
        body: newBook,
    };
});
