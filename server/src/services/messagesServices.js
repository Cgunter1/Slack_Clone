import mongoose from 'mongoose';
import messageSchema from '../models/MessageModel.js';
import channelServices from './channelsServices.js';
import logger from '../config.js';

let log = logger.log;

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

// Creates Message on channel_id.

async function createMessage(channelId, userName, message){
    try{
        let messages = new messageSchema({
            channel_id: channelId, 
            username: userName,
            message: message,
            date: Date.now(),
        });
        await messages.save();
        // Updates the time of the channel last written to.
        let channel = await channelServices.getChannel(channelId);
        channel.date = Date.now();
        await channel.save();
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
    createMessage,
    removeMessage,
};
