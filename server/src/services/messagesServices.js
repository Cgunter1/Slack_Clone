import mongoose from 'mongoose';
import messageSchema from '../models/MessageModel.js';
import {log} from '../config.js';

// Find messages by channelId.
// Returns message Array

async function findMessages(channelId){
    try{
        let messages = await messageSchema.find({channel_id: channelId});
        return messages;
    } catch(e){
        log.error(e);
    }
}

// Delete messages by message_id.

async function removeMessage(messageId){
    try{
        await messageSchema.deleteOne({_id: messageId});
    } catch(e){
        log.error(e);
    }
}

export default {
    findMessages,
    removeMessage,
};
