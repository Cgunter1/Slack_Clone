import mongoose from 'mongoose';
import userSchema from '../models/UserModel.js';
import channelService from './channelsServices.js';
import logger from '../config.js';
import deepEqual from 'deep-equal';

let log = logger.log;

// Add user to channel.
// Explanation: Basically this goes to the userSchema and finds
// the user that the current user wants to add, if the user finds
// him, the current channelId is added to that user's channels.
async function addPersonToChannel(channelId, channelName, personId){
  try{
    let user = await userSchema.findById(personId);
    let channel = await channelService.getChannel(channelId);
    user.channels.push({name: channelName, id: channelId});
    ++channel.members;
    await channel.save();
    await user.save();
    log.info(`Logged ${channelName} into ${user.username}`);
  }catch(e){
    log.error(e)
    return e;
  }
}

async function removeChannel(userId, channelId, isFriendChannel){
  let user = await findUser('id', userId);
  let channel = await channelService.getChannel(channelId);
  let newChannel = [];
  let channelType = (isFriendChannel? user.friends: user.channels);
  for(let channel of channelType) {
    if(!deepEqual(channel.id, channelId)) {
      newChannel.push(channel);
    }
  } 
  if(isFriendChannel){
    user.friends = newChannel;
  } else {
    user.channels = newChannel;
  }
  await user.save();
  if(channel) {
    --channel.members;
    await channel.save();
  }
  return null;
}


// Deletes the User from the database from whatever info that is provided.
async function deleteUser(personInfo){
  try{
    let request = userSchema.deleteOne(personInfo);
    return request;
  } catch(e){
    log.error(e);
    return e;
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

async function findUser(query, value) {
  try {
    let user;
    if(query === 'id') user = await userSchema.findById(value);
    if(query === 'name') user = await userSchema.findOne({username: value});
    return user;
  } catch(e) {
    return e;
  }
}

// Add user to friends. Arguments: Username and friendName
// Explanation: This updates the document by appending a new username_string
// to the user's own friends and then creates a new channel for that friend.
// *******************************************************
// *** Don't forget to increment channel members by 1. ***
// *******************************************************
async function addFriend(userName, userId, friendName){
    try{
        let user = await findUser('id', userId);
        let friend = await findUser('name', friendName);
        let channel = await channelService.createChannel(
          userName, userId, friendName, true);
        ++channel.members;
        user.friends.push({name: friend.username, id: channel._id});
        friend.friends.push({name: user.username, id: channel._id});
        await user.save();
        await friend.save();
        await channel.save();
    }catch(e){
        log.error(e);
    }
}


// Remove friend. Arguments: Username, friendName and friendObjectId
// Explanation: Removes the friend from the friends array and objectid from
// channels objectId.
async function removeFriend(userId, channelName, channelId){
  try{
      let user = await findUser('id', userId);
      let friend = await findUser('name', channelName);
      console.log(friend._id);
      await channelService.removeChannel(userId, channelId, true);
      let userFriends = [];
      let friendFriends = [];
      for(let person of user.friends) {
        if (person.name !== friend.username) userFriends.push(person);
      }
      for(let person of friend.friends) {
        if (person.name !== user.username) friendFriends.push(person);
      }
      user.friends = userFriends;
      friend.friends = friendFriends;
      let response = await friend.save();
      let response2 = await user.save();
      console.log(response);
      console.log(response2);
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
  findUser,
  deleteUser,
  removeChannel,
};
