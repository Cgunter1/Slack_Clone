"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is the schema for the message collection of the MongoDB.
const messageSchema = new _mongoose.default.Schema({
  // The messageSchema will have id for the message that it belongs to.
  // The reason is so that a thread can have an unlimited number of messages.
  // With embedding the messages instead into the channel collection, that
  // would limit the number of messages a thread could have.
  channel_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    index: true
  },
  username: String,
  message: String,
  date: {
    type: Date,
    default: Date.now
  }
});

var _default = _mongoose.default.model('Message', messageSchema);

exports.default = _default;