import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    channels: [{ type: Number, ref: 'Channel' }],
});

export const User = mongoose.model('User', UserSchema);
