"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This will be the api that will serve the messages from the MongoDB database.
// import bodyParser from 'body-parser';
const router = _express.default.Router();

router.get('/:userId/:channelId', (req, res) => {// When the request reaches the database api, the api
  // checks if the id given and any of the other user ids of the conversation
  // are the same. If they aren't, it fails.
});
router.post('/:userId/:channelId', (req, res) => {// The information is checked with the userId to make sure that is correct.
  // The post body is given with the userId, message, timestamp.
});
var _default = router;
exports.default = _default;