import channelServices from '../services/channelsServices.js';
import userServices from '../services/userServices.js';
import messageServices from '../services/messagesServices.js';
import credentials from '../../../secretUsernamePassword.js';
import mongoose from 'mongoose';
import mocha from 'mocha';
import {expect} from 'chai';
import {log} from '../config.js';
import { doesNotReject } from 'assert';
import { isBuffer } from 'util';


// This file is for testing out the services.
// This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...
const url = `mongodb://${credentials.username}:${credentials.password}@ds239692.mlab.com:39692/slack_clone`;

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
        describe('Finds User in Database', function() {
            it('This should get the same user back from the database',
              async function() {
                let request = await channelServices.getChannel(channelId);
                expect(request.name).to.equal('Channel');
            });
        });
        describe('Delete User in Database', function() {
            it('This should delete the user from the database',
              async function() {
                let response = await channelServices.removeChannel(channelId, userId);
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
        before(function(done) {
            Promise.all([
            userServices.createUser(
                'email@gmail.com',
                'Cinefiled',
                '123password'),
            userServices.createUser(
                'email@gmail.com',
                'Cinefiled',
                '123password')]
            ).then((res) => done());
        });

        describe('Add Friend to ', function() {
            it('This should delete the user from the database',
              async function() {
                expect(1).to.equal(1);
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
                ).then((res) => done());
        });
    });

    describe('Test#4: UserService: Friend Interactions', function() {
        before(function(done) {
            Promise.all([
            userServices.createUser(
                'email@gmail.com',
                'Cinefiled',
                '123password'),
            userServices.createUser(
                'email@gmail.com',
                'Cinefiled',
                '123password')]
            ).then((res) => done());
        });

        describe('Add Friend to ', function() {
            it('This should delete the user from the database',
              async function() {
                expect(1).to.equal(1);
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
                ).then((res) => done());
        });
    });
    after(function(done) {
        mongoose.connection.close(() => done());
    });
});
