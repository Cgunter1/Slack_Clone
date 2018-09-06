"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This will be the api that will serve the messages from the MongoDB database.
// import bodyParser from 'body-parser';
const router = _express.default.Router(); // This is used to update the users password.
// First ask them for the account's username.
// Ask them security questions.
// If they pass, ask them for their phone number.
// Like for example, (***) *** -**17


router.post('/updatePassword_Questions_PhoneNumber', (req, res) => {}); // After that, create a token on the database that
// will expire after a day. The token will be sent
// either through SMS or email using Twilio.

router.post('/updatePassword_token', (req, res) => {}); // This route creates the user.
// Accepts username, email, and password.
// Eventually phoneNumber and security questions.

router.post('/newUser', (req, res) => {// Body will include the userId, 
  // The information is checked with the userId to make sure that is correct.
  // The post body is given with the userId, message, timestamp.
});
var _default = router;
exports.default = _default;