"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _channelModel = _interopRequireDefault(require("../models/channelModel.js"));

var _userServices = _interopRequireDefault(require("./userServices.js"));

var _config = _interopRequireDefault(require("../config.js"));

var _constants = require("constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let log = _config.default.log;
/* Add channel from user.
//  Explanation: This creates a new channel and
 adds it to the ownership of the user.
*/

async function createChannel(userName, userId, channelName, isFriendChannel) {
  try {
    let channel = new _channelModel.default({
      name: channelName,
      members: 1
    });
    let newChannel = await channel.save(); // Update channel to the user collection.

    if (!isFriendChannel) await _userServices.default.addChannel(channel.name, channel._id, userId);
    return newChannel;
  } catch (e) {
    log.error(e);
    return e;
  }
} // Get channel from channel objectId.


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
} // Get channel from channel objectId.
// It recieves a channelId and a userId for the one deleting it.


async function removeChannel(userId, channelId, friendChannel) {
  try {
    let response = null;
    if (friendChannel) return await _channelModel.default.deleteOne({
      _id: channelId
    });
    await _userServices.default.removeChannel(userId, channelId, friendChannel);
    let channel = await getChannel(channelId);
    if (channel !== null && channel.members === 0) response = await _channelModel.default.deleteOne({
      _id: channelId
    });
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