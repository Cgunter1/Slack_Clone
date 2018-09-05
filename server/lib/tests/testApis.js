"use strict";

require("core-js/modules/web.dom.iterable");

var _channelsServices = _interopRequireDefault(require("../services/channelsServices.js"));

var _userServices = _interopRequireDefault(require("../services/userServices.js"));

var _messagesServices = _interopRequireDefault(require("../services/messagesServices.js"));

var _secretUsernamePassword = _interopRequireDefault(require("../../../secretUsernamePassword.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mocha = _interopRequireDefault(require("mocha"));

var _deepEqual = _interopRequireDefault(require("deep-equal"));

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
    describe('Finds Channel in Database', function () {
      it('This should get the same user back from the database', async function () {
        let request = await _channelsServices.default.getChannel(channelId);
        (0, _chai.expect)(request.name).to.equal('Channel');
      });
    });
    describe('Delete Channel in Database', function () {
      it('This should delete the user from the database', async function () {
        let response = await _channelsServices.default.removeChannel(userId, channelId);
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
  describe('Test#3: Add/Remove Channels from Users', function () {
    let userId;
    let friendId;
    let channelId;
    before(function (done) {
      Promise.all([_userServices.default.createUser('email@gmail.com', 'Cinefiled!', '123password'), _userServices.default.createUser('email23@gmail.com', 'Munter', '123password')]).then(function (res) {
        userId = res[0]._id;
        friendId = res[1]._id;
        done();
      });
    });
    describe('Creates Channel and adds it to User array of Channel', function () {
      it('Should return the user array of channels that includes a new Channel', async function () {
        let channelRequest = await _channelsServices.default.createChannel('Cinefiled!', userId, 'Channel');
        channelId = channelRequest._id;
        let user = await _userServices.default.findUser('id', userId);
        (0, _chai.expect)(channelId).to.deep.equal(user.channels[0].id);
      });
    });
    describe('Adds user to newly created Channel', function () {
      it('The new user now have the new channel in its channel array', async function () {
        await _userServices.default.addPersonToChannel(channelId, 'Channel', friendId);
        let user = await _userServices.default.findUser('id', friendId);
        (0, _chai.expect)(channelId).to.deep.equal(user.channels[0].id);
      });
    });
    describe('Removes friend from channel', function () {
      it('The user should now not have the channel in the array', async function () {
        await _channelsServices.default.removeChannel(friendId, channelId);
        let user = await _userServices.default.findUser('id', friendId);
        (0, _chai.expect)(user.channels.length).to.equal(0);
      });
    });
    describe('Remove last user from channel', function () {
      it('should return anything but null, because no users means removal of channel', async function () {
        let response = await _channelsServices.default.removeChannel(userId, channelId);
        (0, _chai.expect)(response.ok).to.equal(1);
      });
    });
    after(function (done) {
      Promise.all([_userServices.default.deleteUser({
        email: 'email@gmail.com',
        username: 'Cinefiled!'
      }), _userServices.default.deleteUser({
        email: 'email23@gmail.com',
        username: 'Munter'
      })]).then(res => done());
    });
  });
  describe('Test#4: UserService: Friend Interactions', function () {
    before(function (done) {
      Promise.all([_userServices.default.createUser('email@gmail.com', 'Cinefiled', '123password'), _userServices.default.createUser('email123@gmail.com', 'Cgunter', '123password')]).then(res => done());
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