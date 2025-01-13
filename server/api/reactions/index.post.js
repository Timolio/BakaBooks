import { Reaction } from '~/server/models/reaction.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const newReaction = new Reaction(body);

    await newReaction.save();

    return newReaction;
});
