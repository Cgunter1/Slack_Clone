"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepEqual = _interopRequireDefault(require("deep-equal"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));

var _channelsServices = _interopRequireDefault(require("./channelsServices.js"));

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */

/* eslint-enable */
let log = _config.default.log;
/**
 * Add user to channel.
 * Explanation: Basically this goes to the userSchema and finds
 * the user that the current user wants to add, if the user finds
 * him, the current channelId is added to that user's channels.
 * @param {number} channelId The id of the channel.
 * @param {string} channelName The name of the channel.
 * @param {number} personId The id of the person to add.
 * @return {error} Returns error if there is a problem with the insertion.
 */

async function addPersonToChannel(channelId, channelName, personId) {
  try {
    let user = await _UserModel.default.findById(personId);
    let channel = await _channelsServices.default.getChannel(channelId);
    user.channels.push({
      name: channelName,
      id: channelId
    });
    ++channel.members;
    await channel.save();
    await user.save();
    log.info(`Logged ${channelName} into ${user.username}`);
  } catch (e) {
    log.error(e);
    return e;
  }
}
/**
 * Removes a channel from a user's array of channels.
 * @param {number} userId The id of the channel.
 * @param {number} channelId The id of the channel.
 * @param {boolean} isFriendChannel Bool of type of channel.
 * @return {null} Returns null when finished.
 */


async function removeChannel(userId, channelId, isFriendChannel) {
  let user = await findUser('id', userId);
  let channel = await _channelsServices.default.getChannel(channelId);
  let newChannel = [];
  let channelType = isFriendChannel ? user.friends : user.channels;

  for (let channel of channelType) {
    if (!(0, _deepEqual.default)(channel.id, channelId)) {
      newChannel.push(channel);
    }
  }

  if (isFriendChannel) {
    user.friends = newChannel;
  } else {
    user.channels = newChannel;
  }

  await user.save();

  if (channel) {
    --channel.members;
    await channel.save();
  }

  return null;
}
/**
 * Deletes the User from the database from whatever info that is provided.
 * @param {object} personInfo Any kind of info on user to delete.
 * @return {object} Returns either returns a response object if
 * successful and error if not.
 */


async function deleteUser(personInfo) {
  try {
    let request = _UserModel.default.deleteOne(personInfo);

    return request;
  } catch (e) {
    log.error(e);
    return e;
  }
}
/**
 * This is for creating the user.
 * @param {string} userEmail The email of the user.
 * @param {string} userName The name of the user.
 * @param {string} userPassword The password of the user to add.
 * @return {object} Returns user schema if successful or error object
 * if not successful. Or returns null if the username already exists.
 */


async function createUser(userEmail, userName, userPassword) {
  try {
    console.log("dasdsa");
    let possibleUser = await findUser('name', userName);
    console.log("354543");

    if (possibleUser !== null) {
      console.log("da123");
      return null;
    } else {
      /* eslint-disable */
      let user = new _UserModel.default({
        /* eslint-enable */
        username: userName,
        password: userPassword,
        email: userEmail
      });
      console.log("dsadas");
      return await user.save();
    }
  } catch (e) {
    console.log("321213");
    console.log('possibleUser.username');
    log.error(e);
    return e;
  }
}
/**
 * After every friend is added to the user, a new channel will be created
 * for them with the friend's name as the title.
 * @param {string} query Type of value to search id/username.
 * @param {string} value Value of the query. (String or Number)
 * @return {object} Returns user object or error object.
 */


async function findUser(query, value) {
  try {
    let user;
    if (query === 'id') user = await _UserModel.default.findById(value);
    if (query === 'name') user = await _UserModel.default.findOne({
      username: value
    });
    return user;
  } catch (e) {
    return e;
  }
} // Add user to friends. Arguments: Username and friendName
// Explanation: This updates the document by appending a new username_string
// to the user's own friends and then creates a new channel for that friend.
// *******************************************************
// *** Don't forget to increment channel members by 1. ***
// *******************************************************

/**
 * This is for creating the user.
 * @param {string} userName Name of user that is friending.
 * @param {number} userId Id of user that is friending.
 * @param {string} friendName Name of person to friend.
 */


async function addFriend(userName, userId, friendName) {
  try {
    let user = await findUser('id', userId);
    let friend = await findUser('name', friendName);
    let channel = await _channelsServices.default.createChannel(userName, userId, friendName, true);
    ++channel.members;
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
    await channel.save();
  } catch (e) {
    log.error(e);
  }
}
/**
 * Removes the friend from the friends array and objectid from
 * channels objectId..
 * @param {number} userId Id of the user that is removing the friend.
 * @param {string} channelName Name of the friend and channel to remove.
 * @param {number} channelId Id of the channel that both users
 * are connnected to.
 */


async function removeFriend(userId, channelName, channelId) {
  try {
    let user = await findUser('id', userId);
    let friend = await findUser('name', channelName);
    console.log(friend._id);
    await _channelsServices.default.removeChannel(userId, channelId, true);
    let userFriends = [];
    let friendFriends = [];

    for (let person of user.friends) {
      if (person.name !== friend.username) userFriends.push(person);
    }

    for (let person of friend.friends) {
      if (person.name !== user.username) friendFriends.push(person);
    }

    user.friends = userFriends;
    friend.friends = friendFriends;
    let response = await friend.save();
    let response2 = await user.save();
    console.log(response);
    console.log(response2);
  } catch (e) {
    log.error(e);
  }
}
/**
 * Verifies that both the username and password given match.
 * @param {string} username Name of the user that is submittin.
 * @param {number} possiblePassword Password of the user that is submitting.
 * @return {boolean} Determination of the identity of the user.
 */


async function verifyUserIdentity(username, possiblePassword) {
  try {
    let user = await findUser('name', username);
    let result = await _bcrypt.default.compare(possiblePassword, user.password);

    if (result) {
      return user;
    }

    throw new Error('Bad Login');
  } catch (e) {
    console.error(e);
    return e;
  }
}
/**
 * Get all channels and friends from user_id.
 * @param {number} userId Id of the user that is requesting
 * all the channels of theirs.
 * are connnected to.
 */


async function getUserChannels(userId) {
  try {
    let user = await _UserModel.default.findById(userId);
    return [user.channels, user.friends];
  } catch (e) {
    log.error(e);
  }
}
/**
 * Add new channel to user. This is in response to
 * the channelService createChannel.
 * @param {string} channelName Name of the channel that is being added.
 * @param {number} channelId Id of the channel that is being added.
 * @param {number} userId Id of the user that is adding the channel.x
 */


async function addChannel(channelName, channelId, userId) {
  try {
    let user = await _UserModel.default.findById(userId);
    user.channels.push({
      name: channelName,
      id: channelId
    });
    await user.save();
  } catch (e) {
    log.error(e);
  }
}

var _default = {
  addPersonToChannel,
  addFriend,
  removeFriend,
  getUserChannels,
  addChannel,
  createUser,
  findUser,
  deleteUser,
  removeChannel,
  verifyUserIdentity
};
exports.default = _default;