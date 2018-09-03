"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _MessageModel = _interopRequireDefault(require("../models/MessageModel.js"));

var _config = require("../config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Find messages by channelId.
// Returns message Array
async function findMessages(channelId) {
  try {
    let messages = await _MessageModel.default.find({
      channel_id: channelId
    });
    return messages;
  } catch (e) {
    _config.log.error(e);
  }
} // Delete messages by message_id.


async function removeMessage(messageId) {
  try {
    await _MessageModel.default.deleteOne({
      _id: messageId
    });
  } catch (e) {
    _config.log.error(e);
  }
}

var _default = {
  findMessages,
  removeMessage
};
exports.default = _default;