import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema({
    type: { type: String, enum: ['text', 'image'], required: true },
    value: { type: String, required: true },
});

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    authorId: { type: Number, required: true },
    contentBlocks: [contentBlockSchema],
    createdAt: { type: Date, default: Date.now },
});

export const Book = mongoose.model('Book', BookSchema);
