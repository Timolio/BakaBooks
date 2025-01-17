import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    channels: [{ type: Number, ref: 'Channel' }],
});

export const User = mongoose.model('User', UserSchema);
