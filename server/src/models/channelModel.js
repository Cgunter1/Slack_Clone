import mongoose from 'mongoose';

// This is the schema for the channel collection of the MongoDB.
const channelSchema = mongoose.schema({
    name: String,
});

export default mongoose.model('Channel', channelSchema);
