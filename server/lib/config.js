"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bunyan = _interopRequireDefault(require("bunyan"));

var _bunyanRotatingFileStream = _interopRequireDefault(require("bunyan-rotating-file-stream"));

var _redis = _interopRequireDefault(require("redis"));

var _secretUsernamePassword = _interopRequireDefault(require("../../secretUsernamePassword.js"));

var _bluebird = _interopRequireDefault(require("bluebird"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Below sets up the logging system for the app using bunyan.
// Any logs that are info or error are logged first to the stdout
// then logged into each of their own files respectively.
// After a day or a file size. The files are rolled over for the next messages.
_bluebird.default.promisifyAll(_redis.default.RedisClient.prototype);

_bluebird.default.promisifyAll(_redis.default.Multi.prototype);

let options = {
  name: 'slack_app',
  streams: [{
    level: 'info',
    stream: process.stdout
  }, {
    level: 'info',
    stream: new _bunyanRotatingFileStream.default({
      path: './server/logs/log.info',
      period: '1d',
      totalFiles: 10,
      rotateExisting: true,
      threshold: '10k',
      totalSize: '20k',
      gzip: true
    })
  }, {
    level: 'error',
    stream: process.stdout
  }, {
    level: 'error',
    stream: new _bunyanRotatingFileStream.default({
      path: './server/logs/log.error',
      period: '1d',
      totalFiles: 10,
      rotateExisting: true,
      threshold: '10k',
      totalSize: '20k',
      gzip: true
    })
  }]
};

let log = _bunyan.default.createLogger(options);

const URL = _secretUsernamePassword.default.redisUrl; // Connects to Redis Server.

let redisClient = _redis.default.createClient({
  port: 13663,
  host: URL,
  password: _secretUsernamePassword.default.redisPassword
});

redisClient.on('ready', () => {
  console.log('Redis Client on.');
});
let jwt = {
  hashAlg: 'HS256'
};
var _default = {
  log,
  redisClient,
  jwt
};
exports.default = _default;