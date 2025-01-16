import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema({
    type: { type: String, enum: ['text', 'image'], required: true },
    value: { type: String, required: true },
});

const ChapterSchema = new mongoose.Schema({
    titleId: { type: mongoose.Types.ObjectId, ref: 'Title', default: null },
    order: { type: Number, default: null },
    title: { type: String, required: true },
    cover: { type: String, default: null },
    description: { type: String, default: '' },
    authorId: { type: Number, required: true },
    contentBlocks: [contentBlockSchema],
    createdAt: { type: Date, default: Date.now },
});

export const Chapter = mongoose.model('Chapter', ChapterSchema);
