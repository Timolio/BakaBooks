import mongoose from 'mongoose';

const TitleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    authorId: { type: Number, required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

export const Title = mongoose.model('Title', TitleSchema);
