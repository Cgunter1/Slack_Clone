import mongoose from 'mongoose';
import userSchema from '../models/UserModel.js';
import channelService from './channelsServices.js';
import logger from '../config.js';

let log = logger.log;

// Add user to channel.
// Explanation: Basically this goes to the userSchema and finds
// the user that the current user wants to add, if the user finds
// him, the current channelId is added to that user's channels.
async function addPersonToChannel(channelId, channelName, personId){
  try{
    let user = await userSchema.findById(personId);
    user.channels.push({name: channelName, id: channelId});
    await user.save();
    log.info(`Logged ${channelName} into ${user.username}`);
  }catch(e){
    log.error(e)
  }
}

// This is for creating the user.
async function createUser(userEmail, userName, userPassword){
  try{
    let user = new userSchema({username: userName, password: userPassword, email: userEmail});
    return await user.save();
  } catch(e){
    log.error(e);
    return e;
  }
}

// After every friend is added to the user, a new channel will be created
// for them with the friend's name as the title.


// Add user to friends. Arguments: Username and friendName
// Explanation: This updates the document by appending a new username_string
// to the user's own friends and then creates a new channel for that friend.
async function addFriend(userName, userId, friendName){
    try{
        let user = await userSchema.findById(userId);
        let friend = await userSchema.find({name: friendName});
        let channel = await channelService.createChannel(userName, userId, friendName);
        user.friends.push({name: friend.username, id: channel._id});
        friend.friends.push({name: user.username, id: channel._id});
        await user.save();
        await friend.save();
    }catch(e){
        log.error(e);
    }
}


// Remove friend. Arguments: Username, friendName and friendObjectId
// Explanation: Removes the friend from the friends array and objectid from
// channels objectId.
async function removeFriend(userId, channelName, channelId){
  try{
      let user = await userSchema.findById(userId);
      let friend = await userSchema.find({name: channelName});
      await channelService.removeChannel(channelId);
      user.friends.filter(person => person.name !== friend.username);
      friend.friends.filter(person => person.name !== user.username);
      await user.save();
      await friend.save();
  }catch(e){
      log.error(e);
  }
}

// Get all channels and friends from user_id.
async function getUserChannels(userId){
  try{
    let user = await userSchema.findById(userId);
    return [user.channels, user.friends];
  }catch(e){
    log.error(e);
  }
}

// Add new channel to user. This is in response to
// the channelService createChannel.
// Adds new channel name and id to array.
async function addChannel(channelName, channelId, userId){
  try{
    let user = await userSchema.findById(userId);
    user.channels.push({name: channelName, id: channelId});
    await user.save();
  } catch(e){
    log.error(e);
  }
}

export default {
  addPersonToChannel,
  addFriend,
  removeFriend,
  getUserChannels,
  addChannel,
  createUser,
};
