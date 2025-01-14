import { Book } from '~/server/models/book.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const newBook = new Book(body);

    await newBook.save();

    return {
        statusCode: 201,
        body: newBook,
    };
});
