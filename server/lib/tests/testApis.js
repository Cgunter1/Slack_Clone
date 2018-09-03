"use strict";

var _channelsServices = _interopRequireDefault(require("../services/channelsServices.js"));

var _userServices = _interopRequireDefault(require("../services/userServices.js"));

var _messagesServices = _interopRequireDefault(require("../services/messagesServices.js"));

var _secretUsernamePassword = _interopRequireDefault(require("../../../secretUsernamePassword.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mocha = _interopRequireDefault(require("mocha"));

var _chai = require("chai");

var _config = require("../config.js");

var _assert = require("assert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This file is for testing out the services.
// This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...
const url = `mongodb://${_secretUsernamePassword.default.username}:${_secretUsernamePassword.default.password}@ds239692.mlab.com:39692/slack_clone`; // This establishes the logging I will be using over this project,
// which is bunyan.

const logger = _config.log;
describe('Database Tests', function () {
  before(function (done) {
    _mongoose.default.connect(url, {
      useNewUrlParser: true
    });

    _mongoose.default.connection.once('connected', function () {
      done();
    });
  });
  describe('Test#1: Posting Entry to Database', function () {
    it('This should post a new user to the database.', async function () {
      let request = await _userServices.default.createUser('email@gmail.com', 'Cinefiled', '123password');
      (0, _chai.expect)(request.username).to.equal('Cinefiled');
    });
  });
  after(function (done) {
    _mongoose.default.connection.close(() => done());
  });
});