import mongoose from 'mongoose';
import channelSchema from '../models/channelModel.js';
import userSchema from './userServices.js';
import logger from '../config.js';

let log = logger.log;

/* Add channel from user.
// Explanation: This creates a new channel and
 adds it to the ownership of the user.
*/
async function createChannel(userName, userId, channelName) {
  try{
    let channel = new channelSchema({name: channelName, members: 1});
    let newChannel = await channel.save();  
    // Update channel to the user collection.
    await userSchema.addChannel(channel.name, channel._id, userId);
    return newChannel;
  } catch(e){
    log.error(e);
    return e;
  }
}

// Get channel from channel objectId.
async function getChannel(channelId) {
    try {
        let channel = await channelSchema.findOne({_id: channelId});
        return channel;
    } catch(e) {
        log.error(e);
        return e;
    }
}

// Get channel from channel objectId.
// It recieves a channelId and a userId for the one deleting it.
async function removeChannel(channelId, userId) {
    try {
        let response = null;
        await userSchema.removeChannel(userId);
        let channel = await getChannel(channelId);
        if (channel.members-1 === 0) response = await channelSchema.deleteOne({_id: channelId});
        return response;
    } catch(e){
        log.error(e);
        return e;
    }
}

export default {
    createChannel,
    getChannel,
    removeChannel,
};
