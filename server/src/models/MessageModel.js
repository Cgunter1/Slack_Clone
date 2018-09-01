import mongoose from 'mongoose';

const MessageSchema = mongoose.schema({
    channel_id: {type: mongoose.Schema.Types.ObjectId, index: true},
    username: String,
    message: String,
    date: {type: Date, default: Date.now},
});

export default MessageSchema;
