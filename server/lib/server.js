"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _helmet = _interopRequireDefault(require("helmet"));

var _user_api = _interopRequireDefault(require("./api/user_api.js"));

var _channel_api = _interopRequireDefault(require("./api/channel_api.js"));

var _config = _interopRequireDefault(require("./config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = _config.default.log; // TODO:
// Remember after being finished with all the routes to
// put the entire server under HTTPS!!!!!!
// This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...

const app = (0, _express.default)(); // Body Parser allows for req body.

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
})); // Extra Protection for the api endpoints.

app.use((0, _helmet.default)()); // Makes sure to always log the request, url, and header on every request to
// the server.

app.use((req, res, next) => {
  logger.info(`${req.method} Request of ${req.url} and Body: ${req.headers}`);
  next();
}); // For any urls that are /channel or /user

app.use('/user', _user_api.default);
app.use('/channel', _channel_api.default); // If it is not in the message router or user router
// then it is an erroneous error.

app.all('*', (req, res) => {
  res.status(404).send('Sorry can\'t find that!');
});
var _default = app;
exports.default = _default;