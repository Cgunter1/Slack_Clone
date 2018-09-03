"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _channelModel = _interopRequireDefault(require("../models/channelModel.js"));

var _userServices = _interopRequireDefault(require("./userServices.js"));

var _config = require("../config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Add channel from user.
// Explanation: This creates a new channel and
 adds it to the ownership of the user.
*/
async function createChannel(userName, userId, channelName) {
  let channel = null;

  try {
    let channel = new _channelModel.default({
      name: channelName
    });
    channel = await channel.save(); // Update channel to the user collection.

    channel = await _userServices.default.addChannel(channel.name, channel._id, userId);
    return channel;
  } catch (e) {
    _config.log.error(e);
  }
} // Get channel from channel objectId.


async function getChannel(channelId) {
  let channel = null;

  try {
    channel = await _channelModel.default.find({
      _id: channelId
    });
  } catch (e) {
    _config.log.error(e);
  }

  return channel;
} // Get channel from channel objectId.


async function removeChannel(channelId) {
  try {
    await _channelModel.default.deleteOne({
      _id: channelId
    });
  } catch (e) {
    _config.log.error(e);
  }
}

var _default = {
  createChannel,
  getChannel,
  removeChannel
};
exports.default = _default;