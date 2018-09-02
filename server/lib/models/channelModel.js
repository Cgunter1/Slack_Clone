"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is the schema for the channel collection of the MongoDB.
const ChannelSchema = _mongoose.default.schema({
  name: String,
  users: [String]
});

var _default = ChannelSchema;
exports.default = _default;