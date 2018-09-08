import channelServices from '../services/channelsServices.js';
import userServices from '../services/userServices.js';
import messageServices from '../services/messagesServices.js';
import credentials from '../../../secretUsernamePassword.js';
import mongoose from 'mongoose';
import mocha from 'mocha';
import deepEqual from 'deep-equal';
import {expect} from 'chai';
import {log} from '../config.js';
import { doesNotReject } from 'assert';
import { isBuffer } from 'util';

/**********************************
Go Back Through the services and see
if you could opitimize them with 
Promise.all().
***********************************/
// This file is for testing out the services.
// This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...
const url = `mongodb://${credentials.mongoUsername}:${credentials.mongoPassword}@ds239692.mlab.com:39692/slack_clone`;

// This establishes the logging I will be using over this project,
// which is bunyan.
const logger = log;

describe('Database Tests', function() {

    before(function(done) {
        mongoose.connect(url, {useNewUrlParser: true});
        mongoose.connection.once('connected', function() {
            done();
        });
    });
    // Checks if the user can be inserted, found, and removed from the database.
    describe('Test#1: UserService: Creating, Retrieving, and Deleting Users', 
      function() {
        describe('Adds User to database', function() {
            it('This should post a new user to the database.',
              async function() {
                let request = await userServices.createUser(
                    'email@gmail.com',
                    'Cinefiled',
                    '123password');
                expect(request.username).to.equal('Cinefiled');
            });
        });
        describe('Finds User in Database', function() {
            it('This should get the same user back from the database',
              async function() {
                let request = await userServices.findUser('name', 'Cinefiled');
                expect(request.username).to.equal('Cinefiled');
            });
        });
        describe('Checks Password is Encrypted', function() {
            it('The password retrieved should not be in plaintext',
              async function() {
                let request = await userServices.findUser('name', 'Cinefiled');
                expect(request.password).to.not.equal('password');
            });
        });
        describe('Delete User in Database', function() {
            it('This should delete the user from the database',
              async function() {
                let response = await userServices.deleteUser({
                    email: 'email@gmail.com',
                    username: 'Cinefiled',
                });
                expect(response.ok).to.equal(1);
            });
        });
    });

    describe('Test#2: ChannelService: Create,Find,and Delete Channels',
      function() {
        let userId;
        let channelId;
        before(function(done) {
            userServices.createUser(
                'email@gmail.com',
                'Cinefiled',
                '123password'
            ).then(function(res) {
              userId = res._id;
              done();
            });
        });
        describe('Adds Channel to database', function() {
            it('This should post a new user to the database.',
              async function() {
                let request = await channelServices.createChannel(
                    'Cinefiled',
                    userId,
                    'Channel'
                );
                channelId = request._id;
                expect(request.name).to.equal('Channel');
            });
        });
        describe('Finds Channel in Database', function() {
            it('This should get the same user back from the database',
              async function() {
                let request = await channelServices.getChannel(channelId);
                expect(request.name).to.equal('Channel');
            });
        });
        describe('Delete Channel in Database', function() {
            it('This should delete the user from the database',
              async function() {
                let response = await channelServices.removeChannel(userId, channelId, false);
                expect(response.ok).to.equal(1);
            });
        });
        after(function(done) {
                userServices.deleteUser({
                    email: 'email@gmail.com',
                    username: 'Cinefiled',
                }).then((res) => done());
        });
    });

    describe('Test#3: Add/Remove Channels from Users',
      function() {
        let userId;
        let friendId;
        let channelId;
        before(function(done) {
            Promise.all([
            userServices.createUser(
                'email@gmail.com',
                'Cinefiled!',
                '123password'),
            userServices.createUser(
                'email23@gmail.com',
                'Munter',
                '123password')]
            ).then(function(res) {
                userId = res[0]._id;
                friendId = res[1]._id;
             done();
            });
        });

        describe('Creates Channel and adds it to User array of Channel',
          function() {
            it('Should return the user array of channels that includes a new Channel',
              async function() {
                    let channelRequest = await channelServices.createChannel(
                        'Cinefiled!',
                        userId,
                        'Channel'
                    );

                    channelId = channelRequest._id;

                    let user = await userServices.findUser('id', userId);
                    expect(channelId).to.deep.equal(user.channels[0].id);
            });
        });

        describe('Adds user to newly created Channel',
          function() {
            it('The new user now have the new channel in its channel array',
              async function() {
                    await userServices.addPersonToChannel(
                      channelId, 'Channel', friendId);

                    let user = await userServices.findUser('id', friendId);
                    expect(channelId).to.deep.equal(user.channels[0].id);
            });
        });

        describe('Removes friend from channel',
          function() {
            it('The user should now not have the channel in the array',
              async function() {
                    await channelServices.removeChannel(friendId, channelId, false);

                    let user = await userServices.findUser('id', friendId);

                    expect(user.channels.length).to.equal(0);
            });
        });

        describe('Remove last user from channel', function() {
            it('should return anything but null, because no users means removal of channel',
              async function() {
                let response = await channelServices.removeChannel(
                  userId, channelId, false);

                expect(response.ok).to.equal(1);
            });
        });

        after(function(done) {
            Promise.all([
                userServices.deleteUser({
                    email: 'email@gmail.com',
                    username: 'Cinefiled!',
                    }),
                userServices.deleteUser({
                    email: 'email23@gmail.com',
                    username: 'Munter',
                })]
                ).then((res) => done());
        });
    });

    describe('Test#4: UserService: Friend Interactions', function() {
        let userId;
        let friendId;
        before(function(done) {
            Promise.all([
            userServices.createUser(
                'email654@gmail.com',
                'Cinefiled',
                '123password'),
            userServices.createUser(
                'Mail@gmail.com',
                'Cgunter',
                '123password')]
            ).then(function(res) {
                userId = res[0]._id;
                friendId = res[1]._id;
                done();
            });
        });

        describe('Add Friend to User', function() {
            it('Should add the friend to the user\'s friends list',
              async function() {
                await userServices.addFriend('Cinefiled', userId, 'Cgunter');
                let user = await userServices.findUser('id', userId);
                let friend = await userServices.findUser('id', friendId);
                console.log(friend);
                let channel = await channelServices.getChannel(user.friends[0].id);
                expect(user.friends[0].name).to.equal('Cgunter');
                expect(user.friends[0].id).to.deep.equal(friend.friends[0].id);
                expect(channel.members).to.equal(2);
            });
        });

        describe('Remove Friend from User', function() {
            it('Should remove the friend from the user\'s friends list',
              async function() {
                let name;
                let id;
                let user = await userServices.findUser('id', userId);
                let friendChannel = user.friends.filter(
                  (friend) => friend.name === 'Cgunter');
                ({name, id: id} = friendChannel[0]);
                await userServices.removeFriend(userId, name, id);
                user = await userServices.findUser('id', userId);
                let friend = await userServices.findUser('id', friendId);
                console.log(friend._id);
                let channel = await channelServices.getChannel(id);
                expect(user.friends.length).to.equal(0);
                expect(friend.friends.length).to.equal(0);
                expect(channel).to.equal(null);
            });
        });

        after(function(done) {
            Promise.all([
                userServices.deleteUser({
                    email: 'email654@gmail.com',
                    username: 'Cinefiled',
                    }),
                userServices.deleteUser({
                    email: 'Mail@gmail.com',
                    username: 'Cgunter',
                })]
                ).then((res) => done());
        });
    });
    describe('Test#5: MessageService: ', function() {
        let userId;
        let friendId;
        let channelId;
        let messageId;
        before(function(done) {
            this.timeout(10000);
            Promise.all([
            userServices.createUser(
                'email@gmail.com',
                'Cinefiled',
                '123password'),
            userServices.createUser(
                'email123@gmail.com',
                'Cgunter',
                '123password')]
            ).then(async function(res) {         
                userId = res[0]._id;
                friendId = res[1]._id;
                let result = await channelServices.createChannel(
                    'Cinefiled', userId, 'Blank', false);
                channelId = result._id;
                await userServices.addPersonToChannel(
                  channelId, 'Blank', friendId);
                done();
            });
        });

        describe('Post and Find Message', function() {
            it('Should post a message to the message\'s collection',
              async function() {
                await messageServices.createMessage(
                    channelId, 'Cinefiled', 'Hello World!');
                let result = await messageServices.findMessages(channelId);
                let channelResult = await channelServices.getChannel(
                  channelId);
                messageId = result[0]._id;
                expect(result[0].message).to.equal('Hello World!');
                expect(channelResult._id).to.deep.equal(result[0].channel_id);
            });
        });

        describe('Delete Message', function() {
            it('Should post a delete the message',
              async function() {
                await messageServices.removeMessage(messageId);
                let result = await messageServices.findMessages(channelId);
                console.log(result);
                expect(result.length).to.equal(0);
            });
        });

        after(function(done) {
            Promise.all([
                userServices.deleteUser({
                    email: 'email@gmail.com',
                    username: 'Cinefiled',
                    }),
                userServices.deleteUser({
                    email: 'email123@gmail.com',
                    username: 'Cgunter',
                })]
                ).then(async (res) => {
                    channelServices.removeChannel(userId, channelId, true);
                    done();
                });
        });
    });
    after(function(done) {
        mongoose.connection.close(() => done());
    });
});
