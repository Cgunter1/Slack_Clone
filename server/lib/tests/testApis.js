"use strict";

require("core-js/modules/web.dom.iterable");

var _channelsServices = _interopRequireDefault(require("../services/channelsServices.js"));

var _userServices = _interopRequireDefault(require("../services/userServices.js"));

var _messagesServices = _interopRequireDefault(require("../services/messagesServices.js"));

var _secretUsernamePassword = _interopRequireDefault(require("../../../secretUsernamePassword.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mocha = _interopRequireDefault(require("mocha"));

var _chai = require("chai");

var _config = require("../config.js");

var _assert = require("assert");

var _util = require("util");

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
  }); // Checks if the user can be inserted, found, and removed from the database.

  describe('Test#1: UserService: Creating, Retrieving, and Deleting Users', function () {
    describe('Adds User to database', function () {
      it('This should post a new user to the database.', async function () {
        let request = await _userServices.default.createUser('email@gmail.com', 'Cinefiled', '123password');
        (0, _chai.expect)(request.username).to.equal('Cinefiled');
      });
    });
    describe('Finds User in Database', function () {
      it('This should get the same user back from the database', async function () {
        let request = await _userServices.default.findUser('name', 'Cinefiled');
        (0, _chai.expect)(request.username).to.equal('Cinefiled');
      });
    });
    describe('Checks Password is Encrypted', function () {
      it('The password retrieved should not be in plaintext', async function () {
        let request = await _userServices.default.findUser('name', 'Cinefiled');
        (0, _chai.expect)(request.password).to.not.equal('password');
      });
    });
    describe('Delete User in Database', function () {
      it('This should delete the user from the database', async function () {
        let response = await _userServices.default.deleteUser({
          email: 'email@gmail.com',
          username: 'Cinefiled'
        });
        (0, _chai.expect)(response.ok).to.equal(1);
      });
    });
  });
  describe('Test#2: ChannelService: Create,Find,and Delete Channels', function () {
    let userId;
    let channelId;
    before(function (done) {
      _userServices.default.createUser('email@gmail.com', 'Cinefiled', '123password').then(function (res) {
        userId = res._id;
        done();
      });
    });
    describe('Adds Channel to database', function () {
      it('This should post a new user to the database.', async function () {
        let request = await _channelsServices.default.createChannel('Cinefiled', userId, 'Channel');
        channelId = request._id;
        (0, _chai.expect)(request.name).to.equal('Channel');
      });
    });
    describe('Finds User in Database', function () {
      it('This should get the same user back from the database', async function () {
        let request = await _channelsServices.default.getChannel(channelId);
        (0, _chai.expect)(request.name).to.equal('Channel');
      });
    });
    describe('Delete User in Database', function () {
      it('This should delete the user from the database', async function () {
        let response = await _channelsServices.default.removeChannel(channelId, userId);
        (0, _chai.expect)(response.ok).to.equal(1);
      });
    });
    after(function (done) {
      _userServices.default.deleteUser({
        email: 'email@gmail.com',
        username: 'Cinefiled'
      }).then(res => done());
    });
  });
  describe('Test#3: UserService: Friend Interactions', function () {
    before(function (done) {
      Promise.all([_userServices.default.createUser('email@gmail.com', 'Cinefiled', '123password'), _userServices.default.createUser('email@gmail.com', 'Cinefiled', '123password')]).then(res => done());
    });
    describe('Add Friend to ', function () {
      it('This should delete the user from the database', async function () {
        (0, _chai.expect)(1).to.equal(1);
      });
    });
    after(function (done) {
      Promise.all([_userServices.default.deleteUser({
        email: 'email@gmail.com',
        username: 'Cinefiled'
      }), _userServices.default.deleteUser({
        email: 'email123@gmail.com',
        username: 'Cgunter'
      })]).then(res => done());
    });
  });
  after(function (done) {
    _mongoose.default.connection.close(() => done());
  });
});