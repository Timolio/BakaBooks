import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
    users: [{ type: Number, ref: 'User' }],
    active: { type: Boolean, required: true },
});

export const Channel = mongoose.model('Channel', ChannelSchema);
