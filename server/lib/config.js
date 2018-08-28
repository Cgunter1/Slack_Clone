"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bunyan = _interopRequireDefault(require("bunyan"));

var _bunyanRotatingFileStream = _interopRequireDefault(require("bunyan-rotating-file-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const options = {
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
  }]
};

const log = _bunyan.default.createLogger(options);

var _default = {
  log
};
exports.default = _default;