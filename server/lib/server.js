"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _user_api = _interopRequireDefault(require("./api/user_api.js"));

var _channel_api = _interopRequireDefault(require("./api/channel_api.js"));

var _config = _interopRequireDefault(require("./config.js"));

var _secretUsernamePassword = _interopRequireDefault(require("../../secretUsernamePassword.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import messageRouter from './api/message_api.js';
console.log(_secretUsernamePassword.default.mongoUsername); // This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...

const url = `mongodb://${_secretUsernamePassword.default.mongoUsername}:${_secretUsernamePassword.default.mongoPassword}@ds239692.mlab.com:39692/slack_clone`; // This establishes the logging I will be using over this project,
// which is bunyan.

const logger = _config.default.log;

_mongoose.default.connect(url, () => console.log('Database Connected!'));

const app = (0, _express.default)(); // Body Parser allows for req body.

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.set('PORT', process.env.port || 5000); // Makes sure to always log the request, url, and header on every request to
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
app.listen(app.get('PORT'), () => {
  console.log(`Running on Port ${app.get('PORT')}.`);
});