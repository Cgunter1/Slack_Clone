import mongoose from 'mongoose';

const ChannelSchema = mongoose.schema({
    name: String,
    users: [String],
});

export default ChannelSchema;
