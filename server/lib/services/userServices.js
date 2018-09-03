"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));

var _channelsServices = _interopRequireDefault(require("./channelsServices.js"));

var _config = require("../config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add user to channel.
// Explanation: Basically this goes to the userSchema and finds
// the user that the current user wants to add, if the user finds
// him, the current channelId is added to that user's channels.
async function addPersonToChannel(channelId, channelName, personId) {
  try {
    let user = await _UserModel.default.findById(personId);
    user.channels.push({
      name: channelName,
      id: channelId
    });
    await user.save();

    _config.log.info(`Logged ${channelName} into ${user.username}`);
  } catch (e) {
    _config.log.error(e);
  }
} // After every friend is added to the user, a new channel will be created
// for them with the friend's name as the title.
// Add user to friends. Arguments: Username and friendName
// Explanation: This updates the document by appending a new username_string
// to the user's own friends and then creates a new channel for that friend.


async function addFriend(userName, userId, friendName) {
  try {
    let user = await _UserModel.default.findById(userId);
    let friend = await _UserModel.default.find({
      name: friendName
    });
    let channel = await _channelsServices.default.createChannel(userName, userId, friendName);
    user.friends.push({
      name: friend.username,
      id: channel._id
    });
    friend.friends.push({
      name: user.username,
      id: channel._id
    });
    await user.save();
    await friend.save();
  } catch (e) {
    _config.log.error(e);
  }
} // Remove friend. Arguments: Username, friendName and friendObjectId
// Explanation: Removes the friend from the friends array and objectid from
// channels objectId.


async function removeFriend(userId, channelName, channelId) {
  try {
    let user = await _UserModel.default.findById(userId);
    let friend = await _UserModel.default.find({
      name: channelName
    });
    await _channelsServices.default.removeChannel(channelId);
    user.friends.filter(person => person.name !== friend.username);
    friend.friends.filter(person => person.name !== user.username);
    await user.save();
    await friend.save();
  } catch (e) {
    _config.log.error(e);
  }
} // Get all channels and friends from user_id.


async function getUserChannels(userId) {
  try {
    let user = await _UserModel.default.findById(userId);
    return [user.channels, user.friends];
  } catch (e) {
    _config.log.error(e);
  }
} // Add new channel to user. This is in response to
// the channelService createChannel.
// Adds new channel name and id to array.


async function addChannel(channelName, channelId, userId) {
  try {
    let user = await _UserModel.default.findById(userId);
    user.channels.push({
      name: channelName,
      id: channelId
    });
    await user.save();
  } catch (e) {
    _config.log.error(e);
  }
}

var _default = {
  addPersonToChannel,
  addFriend,
  removeFriend,
  getUserChannels,
  addChannel
};
exports.default = _default;