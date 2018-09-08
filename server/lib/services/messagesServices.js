"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MessageModel = _interopRequireDefault(require("../models/MessageModel.js"));

var _channelsServices = _interopRequireDefault(require("./channelsServices.js"));

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */

/* eslint-enable */
let log = _config.default.log;
/**
 * Find messages by channelId.
 * @param {number} channelId Id of the channel that the messages belong to.
 * @return {array} Returns message Array.
 */

async function findMessages(channelId) {
  try {
    let messages = await _MessageModel.default.find({
      channel_id: channelId
    });
    return messages;
  } catch (e) {
    log.error(e);
  }
}
/**
 * Creates Message on channel_id.
 * @param {number} channelId Id of the channel that the new message belongs to.
 * @param {string} userName Name of the user that submitted the message.
 * @param {string} message Contents of the message.
 */


async function createMessage(channelId, userName, message) {
  try {
    /* eslint-disable */
    let messages = new _MessageModel.default({
      /* eslint-enable */
      channel_id: channelId,
      username: userName,
      message: message,
      date: Date.now()
    });
    await messages.save(); // Updates the time of the channel last written to.

    let channel = await _channelsServices.default.getChannel(channelId);
    channel.date = Date.now();
    await channel.save();
  } catch (e) {
    log.error(e);
  }
}
/**
 * Delete messages by message_id.
 * @param {number} messageId is the id of the message that is going
 * to be deleted.
*/


async function removeMessage(messageId) {
  try {
    await _MessageModel.default.deleteOne({
      _id: messageId
    });
  } catch (e) {
    log.error(e);
  }
}

var _default = {
  findMessages,
  createMessage,
  removeMessage
};
exports.default = _default;