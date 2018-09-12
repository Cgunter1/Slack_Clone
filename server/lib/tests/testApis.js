"use strict";

require("core-js/modules/web.dom.iterable");

var _uuid = _interopRequireDefault(require("uuid"));

var _chai = _interopRequireWildcard(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _http = _interopRequireDefault(require("http"));

var _channelsServices = _interopRequireDefault(require("../services/channelsServices.js"));

var _userServices = _interopRequireDefault(require("../services/userServices.js"));

var _messagesServices = _interopRequireDefault(require("../services/messagesServices.js"));

var _tokenService = _interopRequireDefault(require("../services/tokenService.js"));

var _secretUsernamePassword = _interopRequireDefault(require("../../../secretUsernamePassword.js"));

var _jwtauth = _interopRequireDefault(require("../user-auth/jwtauth.js"));

var _server = _interopRequireDefault(require("../server.js"));

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
Go Back Through the services and see
if you could opitimize them with
Promise.all().
**/
// This file is for testing out the services.
// This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...
const url = `mongodb://${_secretUsernamePassword.default.mongoUsername}:${_secretUsernamePassword.default.mongoPassword}@ds239692.mlab.com:39692/slack_clone`;
let client = _config.default.redisClient; // This establishes the logging I will be using over this project,
// which is bunyan.
// const logger = log;

_chai.default.use(_chaiHttp.default);

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
        let response = await _channelsServices.default.removeChannel(userId, channelId, false);
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
      it('Should add a new Channel to user channel array', async function () {
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
        await _channelsServices.default.removeChannel(friendId, channelId, false);
        let user = await _userServices.default.findUser('id', friendId);
        (0, _chai.expect)(user.channels.length).to.equal(0);
      });
    });
    describe('Remove last user from channel', function () {
      it('should not return null, because last member is removed', async function () {
        let response = await _channelsServices.default.removeChannel(userId, channelId, false);
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
    let userId;
    let friendId;
    before(function (done) {
      Promise.all([_userServices.default.createUser('email654@gmail.com', 'Cinefiled', '123password'), _userServices.default.createUser('Mail@gmail.com', 'Cgunter', '123password')]).then(function (res) {
        userId = res[0]._id;
        friendId = res[1]._id;
        done();
      });
    });
    describe('Add Friend to User', function () {
      it('Should add the friend to the user\'s friends list', async function () {
        await _userServices.default.addFriend('Cinefiled', userId, 'Cgunter');
        let user = await _userServices.default.findUser('id', userId);
        let friend = await _userServices.default.findUser('id', friendId);
        let channel = await _channelsServices.default.getChannel(user.friends[0].id);
        (0, _chai.expect)(user.friends[0].name).to.equal('Cgunter');
        (0, _chai.expect)(user.friends[0].id).to.deep.equal(friend.friends[0].id);
        (0, _chai.expect)(channel.members).to.equal(2);
      });
    });
    describe('Remove Friend from User', function () {
      it('Should remove the friend from the user\'s friends list', async function () {
        let name;
        let id;
        let user = await _userServices.default.findUser('id', userId);
        let friendChannel = user.friends.filter(friend => friend.name === 'Cgunter');
        var _friendChannel$ = friendChannel[0];
        name = _friendChannel$.name;
        id = _friendChannel$.id;
        await _userServices.default.removeFriend(userId, name, id);
        user = await _userServices.default.findUser('id', userId);
        let friend = await _userServices.default.findUser('id', friendId);
        let channel = await _channelsServices.default.getChannel(id);
        (0, _chai.expect)(user.friends.length).to.equal(0);
        (0, _chai.expect)(friend.friends.length).to.equal(0);
        (0, _chai.expect)(channel).to.equal(null);
      });
    });
    after(function (done) {
      Promise.all([_userServices.default.deleteUser({
        email: 'email654@gmail.com',
        username: 'Cinefiled'
      }), _userServices.default.deleteUser({
        email: 'Mail@gmail.com',
        username: 'Cgunter'
      })]).then(res => done());
    });
  });
  describe('Test#5: MessageService', function () {
    let userId;
    let friendId;
    let channelId;
    let messageId;
    before(function (done) {
      Promise.all([_userServices.default.createUser('email@gmail.com', 'Cinefiled', '123password'), _userServices.default.createUser('email123@gmail.com', 'Cgunter', '123password')]).then(async function (res) {
        userId = res[0]._id;
        friendId = res[1]._id;
        let result = await _channelsServices.default.createChannel('Cinefiled', userId, 'Blank', false);
        channelId = result._id;
        await _userServices.default.addPersonToChannel(channelId, 'Blank', friendId);
        done();
      });
    });
    describe('Post and Find Message', function () {
      it('Should post a message to the message\'s collection', async function () {
        await _messagesServices.default.createMessage(channelId, 'Cinefiled', 'Hello World!');
        let result = await _messagesServices.default.findMessages(channelId);
        let channelResult = await _channelsServices.default.getChannel(channelId);
        messageId = result[0]._id;
        (0, _chai.expect)(result[0].message).to.equal('Hello World!');
        (0, _chai.expect)(channelResult._id).to.deep.equal(result[0].channel_id);
      });
    });
    describe('Delete Message', function () {
      it('Should post a delete the message', async function () {
        await _messagesServices.default.removeMessage(messageId);
        let result = await _messagesServices.default.findMessages(channelId);
        (0, _chai.expect)(result.length).to.equal(0);
      });
    });
    after(function (done) {
      Promise.all([_userServices.default.deleteUser({
        email: 'email@gmail.com',
        username: 'Cinefiled'
      }), _userServices.default.deleteUser({
        email: 'email123@gmail.com',
        username: 'Cgunter'
      })]).then(async res => {
        _channelsServices.default.removeChannel(userId, channelId, true);

        done();
      });
    });
  });
  describe('Test#6: JWT Tokens', function () {
    let user = {
      username: 'Cinefiled',
      email: 'cinefiled@yahoo.com'
    };
    let date = Date.now();
    let expDate = date + 1000 * 600;
    let token;
    describe('Create Token and Add to Redis Server', function () {
      it('Should return OK if successfully added', async function () {
        let secretKey = _uuid.default.v4();

        token = _jwtauth.default.jwtGenerate(user, expDate, date, secretKey);
        let result = await _tokenService.default.addSecretKeyToTable(token, secretKey);
        (0, _chai.expect)(result).to.equal('OK');
      });
    });
    describe('Retrieve Secret Key from Redis Server', function () {
      it('Should return back the token, which means its verified', async function () {
        let retrievedKey = await _tokenService.default.findSecretKey(token);

        let verify = _jwtauth.default.jwtVerify(token, retrievedKey);

        (0, _chai.expect)(verify.name).to.equal('Cinefiled');
      });
    });
    after(async function () {
      await _tokenService.default.removeSecretKey(token);
    });
  });
  describe('Test#7: Http Server Routes', function () {
    _server.default.set('PORT', process.env.port || 5000);

    let port = _server.default.get('PORT');

    let host = `http://localhost:${port}`;

    const server = _http.default.createServer(_server.default);

    server.listen(port);
    let permToken;
    let tempToken;
    let userId;
    describe('User Api Interactions:', function () {
      describe('Testing User Creation', function () {
        it('Should return a token and a 200 status', function (done) {
          _chai.default.request(host).post('/user/createUser').type('json').send({
            'username': 'Cinefiled',
            'password': '123password1',
            'email': 'email@gmail.com'
          }).end((err, res) => {
            if (err) throw err;
            userId = res.body.id;
            permToken = res.body.token;
            (0, _chai.expect)(res).to.have.status(200);
            done();
          });
        });
        it('Should return false with a 403 status, because user exists', function (done) {
          _chai.default.request(host).post('/user/createUser').type('json').send({
            'username': 'Cinefiled',
            'password': '123password1',
            'email': 'email@gmail.com'
          }).end((err, res) => {
            if (err) throw err;
            (0, _chai.expect)(res).to.have.status(403);
            done();
          });
        });
      });
      describe('Testing User Login', function () {
        it('Should return a token and a 200 status', function (done) {
          _chai.default.request(host).post('/user/login').type('json').send({
            'username': 'Cinefiled',
            'password': '123password1'
          }).end((err, res) => {
            if (err) throw err;
            tempToken = res.body.token;
            (0, _chai.expect)(res).to.have.status(200);
            done();
          });
        });
      });
      describe('Testing User Logout', function () {
        it('Should return a 200 status', function (done) {
          _chai.default.request(host).post('/user/logout').type('json').set({
            'authorization': `Bearer ${tempToken}`
          }).end((err, res) => {
            if (err) throw err;
            (0, _chai.expect)(res).to.have.status(200);
            done();
          });
        });
      });
    });
    describe('Channel Api Interactions:', function () {
      let channelId;
      before(function (done) {
        Promise.all([_channelsServices.default.createChannel('Cinefiled', userId, 'Channel', false)]).then(res => {
          channelId = res[0]._id;
          Promise.all([_messagesServices.default.createMessage(channelId, 'Cinefiled', 'H'), _messagesServices.default.createMessage(channelId, 'Cinefiled', 'W')]).then(res => done());
        });
      });
      describe('Post and retrieve a couple Messages by User', function () {
        it('Should Return Messages in the Correct Order', function (done) {
          _chai.default.request(host).get('/channel/Channel').type('json').set({
            'authorization': `Bearer ${permToken}`
          }).end((err, res) => {
            if (err) throw err;
            (0, _chai.expect)(res.body.messages[1].channel_id).to.deep.equal(channelId.id);
            (0, _chai.expect)(res).to.have.status(200);
            done();
          });
        });
      });
    });
    after(function (done) {
      Promise.all([_userServices.default.deleteUser({
        username: 'Cinefiled'
      })]).then(() => done());
    });
  });
  after(function (done) {
    _mongoose.default.connection.close(() => client.quit(done()));
  });
});