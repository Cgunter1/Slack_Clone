"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _channelModel = _interopRequireDefault(require("../models/channelModel.js"));

var _userServices = _interopRequireDefault(require("./userServices.js"));

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */

/* eslint-enable */
let log = _config.default.log;
/**
 * Add channel from user. This creates a new channel and
 * adds it to the ownership of the user.
 * @param {string} userName Name of the user that is creating the channel.
 * @param {number} userId Id of the user that is adding the new channel.
 * @param {string} channelName Name of the channel that is being added.
 * @param {boolean} isFriendChannel Bool that represents the type of channel.
 * @return {object} The new Object of the channel or an error object.
 */

async function createChannel(userName, userId, channelName, isFriendChannel) {
  try {
    /* eslint-disable */
    let channel = new _channelModel.default({
      name: channelName,
      members: 1
    });
    /* eslint-enable */

    let newChannel = await channel.save(); // Update channel to the user collection.

    if (!isFriendChannel) {
      await _userServices.default.addChannel(channel.name, channel._id, userId);
    }

    return newChannel;
  } catch (e) {
    log.error(e);
    return e;
  }
}
/**
 * Get channel from channel objectId.
 * @param {number} channelId Name of the user that is creating the channel.
 * @return {object} The Object will be the channel returned or an error.
 */


async function getChannel(channelId) {
  try {
    let channelRequest = await _channelModel.default.findOne({
      _id: channelId
    });
    return channelRequest;
  } catch (e) {
    log.error(e);
    return e;
  }
}
/**
 * Deletes channel from channel objectId.
 * It recieves a channelId and a userId for the one deleting it.
 * If it's the person removing the channel is the last one, the channel
 * is then removed by itself. Otherwise, the member of the channel is
 * subtracted by 1. If the channel is between 2 friends (shown with
 * friendChannel), the channel is deleted outright.
 * @param {number} userId Name of the user that is removing the channel.
 * @param {number} channelId Id of the channel that is being removed.
 * @param {number} friendChannel Name of the user that is creating the channel.
 * @return {object} The Object will be the channel removed, null, or an error.
 */


async function removeChannel(userId, channelId, friendChannel) {
  try {
    let response = null;

    if (friendChannel) {
      return await _channelModel.default.deleteOne({
        _id: channelId
      });
    }

    await _userServices.default.removeChannel(userId, channelId, friendChannel);
    let channel = await getChannel(channelId);

    if (channel !== null && channel.members === 0) {
      response = await _channelModel.default.deleteOne({
        _id: channelId
      });
    }

    return response;
  } catch (e) {
    log.error(e);
    return e;
  }
}

var _default = {
  createChannel,
  getChannel,
  removeChannel
};
exports.default = _default;