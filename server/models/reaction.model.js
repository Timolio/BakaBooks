import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
    chapterId: { type: mongoose.Types.ObjectId, ref: 'Book', required: true },
    blockId: { type: mongoose.Types.ObjectId, required: true },
    type: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    authorId: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Reaction = mongoose.model('Reaction', ReactionSchema);
