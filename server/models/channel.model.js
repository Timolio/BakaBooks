import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    users: [{ type: Number, ref: 'User' }],
    active: { type: Boolean, required: true },
});

export const Channel = mongoose.model('Channel', ChannelSchema);
