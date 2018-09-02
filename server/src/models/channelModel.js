import mongoose from 'mongoose';

// This is the schema for the channel collection of the MongoDB.
const ChannelSchema = mongoose.schema({
    name: String,
    users: [String],
});

export default ChannelSchema;
