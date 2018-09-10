"use strict";

var _http = _interopRequireDefault(require("http"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _server = _interopRequireDefault(require("../server.js"));

var _config = _interopRequireDefault(require("../config.js"));

var _secretUsernamePassword = _interopRequireDefault(require("../../../secretUsernamePassword.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This establishes the logging I will be using over this project,
// which is bunyan.
const logger = _config.default.log;
let d = new Date(Date.now());
const url = `mongodb://${_secretUsernamePassword.default.mongoUsername}:${_secretUsernamePassword.default.mongoPassword}@ds239692.mlab.com:39692/slack_clone`;

_mongoose.default.connect(url, {
  useNewUrlParser: true
}, () => logger.info(`Database Connected on Date: ${d.toDateString()} 
    Time: ${d.toTimeString()}`));

_server.default.set('PORT', process.env.port || 5000);

let port = _server.default.get('PORT'); // TODO:
// At somepoint make this run a https server.


const server = _http.default.createServer(_server.default);

server.listen(port);
server.on('error', err => logger.error(err));
server.on('listening', () => logger.info(`Listening on PORT ${port}.`));