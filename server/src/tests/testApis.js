import channelServices from '../services/channelsServices.js';
import userServices from '../services/userServices.js';
import messageServices from '../services/messagesServices.js';
import credentials from '../../../secretUsernamePassword.js';
import mongoose from 'mongoose';
import mocha from 'mocha';
import {expect} from 'chai';
import {log} from '../config.js';
import { doesNotReject } from 'assert';


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
    describe('Test#1: Posting Entry to Database', function() {
        it('This should post a new user to the database.',
          async function() {
                let request = await userServices.createUser(
                    'email@gmail.com',
                    'Cinefiled',
                    '123password');
                expect(request.username).to.equal('Cinefiled');
            });
    });
    after(function(done) {
        mongoose.connection.close(() => done());
    });
});
