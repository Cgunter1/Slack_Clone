import mongoose from 'mongoose';
import channelSchema from '../models/channelModel.js';
import userScheme from './userServices.js';
import {log} from '../config.js';

/* Add channel from user.
// Explanation: This creates a new channel and
 adds it to the ownership of the user.
*/
async function createChannel(userName, userId, channelName) {
  let channel = null;
  try{
    let channel = new channelSchema({name: channelName});
    channel = await channel.save();  
    // Update channel to the user collection.
    channel = await userScheme.addChannel(channel.name, channel._id, userId);
    return channel;
  } catch(e){
      log.error(e);
  }
}

// Get channel from channel objectId.
async function getChannel(channelId){
    let channel = null;
    try{
        channel = await channelSchema.find({_id: channelId});
    } catch(e){
        log.error(e);
    }
    return channel;
}

// Get channel from channel objectId.
async function removeChannel(channelId){
    try{
        await channelSchema.deleteOne({_id: channelId});
    } catch(e){
        log.error(e);
    }
}

export default {
    createChannel,
    getChannel,
    removeChannel,
};
