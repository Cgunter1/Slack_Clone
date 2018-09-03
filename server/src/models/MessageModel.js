import mongoose from 'mongoose';

// This is the schema for the message collection of the MongoDB.
const messageSchema = new mongoose.Schema({
    // The messageSchema will have id for the message that it belongs to.
    // The reason is so that a thread can have an unlimited number of messages.
    // With embedding the messages instead into the channel collection, that
    // would limit the number of messages a thread could have.
    channel_id: {type: mongoose.Schema.Types.ObjectId, index: true},
    username: String,
    message: String,
    date: {type: Date, default: Date.now},
});

export default mongoose.model('Message', messageSchema);
