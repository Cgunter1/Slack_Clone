import mongoose from 'mongoose';

// This is the schema for the channel collection of the MongoDB.
const channelSchema = new mongoose.Schema({
    name: String,
    date: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model('Channel', channelSchema);
