"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

var _express = _interopRequireDefault(require("express"));

var _tokenService = _interopRequireDefault(require("../services/tokenService"));

var _jwtauth = _interopRequireDefault(require("../user-auth/jwtauth.js"));

var _userServices = _interopRequireDefault(require("../services/userServices"));

var _messagesServices = _interopRequireDefault(require("../services/messagesServices"));

var _channelsServices = _interopRequireDefault(require("../services/channelsServices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This will be the api that will serve the messages from the MongoDB database.
// import bodyParser from 'body-parser';
const router = _express.default.Router(); // TODO:
// Add Channel.
// Add Friend to channel.
// Remove Channel.
// Verifies Users before going to any of the channels.


router.use(async function (req, res, next) {
  if (!req.headers.authorization) {
    res.status(403).send('Could not verify');
  } else {
    try {
      let bearer = req.headers.authorization.split(' ');
      let token = bearer[1];
      let key = await _tokenService.default.findSecretKey(token);

      let verify = _jwtauth.default.jwtVerify(token, key);

      if (verify) {
        res.locals.id = verify.id;
        res.locals.username = verify.username;
        next();
      } else {
        res.status(403).send('Could not verify');
      }
    } catch (e) {
      res.status(403).send('Could not verify');
    }
  }
});
router.get('/addChannel/:channelName', async (req, res) => {
  try {
    let channel = await _channelsServices.default.createChannel(res.locals.username, res.locals.id, req.params.channelName, false);
    res.status(200).json({
      status: true,
      channel: channel
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: false
    });
  }
});
router.delete('/removeChannel/:channelName', async (req, res) => {
  if (!req.body.channelId) res.status(404).json({
    status: false
  });
  let channelId = req.body.channelId;

  try {
    await _channelsServices.default.removeChannel(res.locals.id, channelId, false);
    res.status(200).json({
      status: true
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: false
    });
  }
});
router.get('/:channelName', async (req, res) => {
  // Parameters: channelId, count(optional), and userId.
  // *In **React**, before sending a request,
  // React would check in its state that the user has access
  // to this particular channel.*
  let user = await _userServices.default.findUser('id', res.locals.id);
  let channelId;

  for (let channel of user.channels) {
    if (channel.name === req.params.channelName) {
      channelId = channel.id;
      break;
    }
  }

  if (!channelId) {
    for (let channel of user.friends) {
      channelId = channel.id;
      break;
    }

    if (!channelId) res.status(403).json({
      status: false
    });
  }

  let messages = await _messagesServices.default.findMessages(channelId);
  res.status(200).json({
    id: channelId,
    messages: messages
  }); // Want to implement a way to request 20 messages at a time.
  // The count will be used to count the number of messages at a time.
  // Would have to redesign channelModel.
  // A way one could change it is where you have a channelModel that keeps
  // an array of message ObjectIds. At a point where the number of ObjectIds
  // become greater that 10k. One would create a new channel
  // to store those old messages in.
  // And the current channel document would wipe all those messages
  // and keep the channelId
  // for the new channel that holds those old messages.
  // It would function like a linkedList:
  //     CurrentChannel <10k -> 2ndChannel 10k -> 3rdChannel 10k.
  // The 2nd Channel and 3rd Channel Ids would only be privy
  // to the currentChannel.
  // When the router recieves this request, it will return all
  // the messages associated with that channelId.
});
router.post('/:channelId', (req, res) => {// The information is checked with the userId to make sure that is correct through auth0.
  // The post body is given with the userId, message, timestamp.
  // res.status(200).send(res.locals.username);
});
var _default = router;
exports.default = _default;