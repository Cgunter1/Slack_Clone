// This will be the api that will serve the messages from the MongoDB database.
import express from 'express';
import tokenServices from '../services/tokenService';
import jwtAuth from '../user-auth/jwtauth.js';
import jwtTokenVerify from 'validator/lib/isJWT';
import mongoIdVerify from 'validator/lib/isMongoId';
import trim from 'validator/lib/trim';
import userServices from '../services/userServices';
import messagesServices from '../services/messagesServices';
import channelsServices from '../services/channelsServices';
// import bodyParser from 'body-parser';

const router = express.Router();

// TODO:
// Add Friend to channel.
// Add verification headers to check each of the types
// for the api components like channelId for Mongo ObjectId.
// Also add tests for addMessage and addFriend

// Verifies Users before going to any of the channels.
router.use(async function(req, res, next) {
    if (!req.headers.authorization) {
        res.status(403).send('Could not verify');
    } else {
        try {
        let bearer = req.headers.authorization.split(' ');
        let token = bearer[1];
        if (!jwtTokenVerify(token)) throw new Error('Not JWT');
        let key = await tokenServices.findSecretKey(token);
        let verify = jwtAuth.jwtVerify(token, key);
        if (verify) {
            res.locals.id = verify.id;
            res.locals.username = verify.username;
            next();
        } else {
            res.status(403).send('Could not verify');
        }
        } catch (e) {
            res.status(403).send('Could not verify');
        }
    }
});

// Creates a channel and adds to user's profile.
// params: channelName (String)
// return: json is returned with 200 and channelObject if true
// or 404 status as false if false.
router.get('/addChannel/:channelName', async (req, res) => {
    try {
        let channel = await channelsServices.createChannel(
            res.locals.username,
            res.locals.id,
            req.params.channelName,
            false);
        res.status(200).json({status: true, channel: channel});
    } catch (e) {
        console.error(e);
        res.status(404).json({status: false});
    }
});

// Removes a channel from the user's profile, and deletes it and
// all messages if that user is the only member.
// params: channelName (String)
// body: channelId (MongoId)
// return: json is returned with 200 and status as true if true
// or 404 and status as false if false.
router.delete('/removeChannel/:channelName', async (req, res) => {
    if (!req.body.channelId) res.status(404).json({status: false});
    let channelId = req.body.channelId;
    try {
        if (!mongoIdVerify(channelId)) throw new Error('channelId not MongoId');
        await channelsServices.removeChannel(
            res.locals.id,
            channelId,
            false,
        );
        res.status(200).json({status: true});
    } catch (e) {
        console.error(e);
        res.status(404).json({status: false});
    }
});

// Retrieves a channelObject based on the name of the channel
// and userId
// params: channelName(String).
// body: channelId(MongoId) and userId(number).
// return: json is returned with 200, channelId, and messages if true
// or 403/404 and status as false if false.
router.get('/:channelName', async (req, res) => {
    // *In **React**, before sending a request,
    // React would check in its state that the user has access
    // to this particular channel.*
    let user = await userServices.findUser('id', res.locals.id);
    let channelId;
    for (let channel of user.channels) {
        if (channel.name === req.params.channelName) {
            channelId = channel.id;
            break;
        }
    }
    if (!channelId) {
        for (let channel of user.friends) {
            channelId = channel.id;
            break;
        }
        if (!channelId) res.status(403).json({status: false});
    }

    let messages = await messagesServices.findMessages(channelId);
    res.status(200).json({id: channelId, messages: messages});
    // Want to implement a way to request 20 messages at a time.
    // The count will be used to count the number of messages at a time.
    // Would have to redesign channelModel.
    // A way one could change it is where you have a channelModel that keeps
    // an array of message ObjectIds. At a point where the number of ObjectIds
    // become greater that 10k. One would create a new channel
    // to store those old messages in.
    // And the current channel document would wipe all those messages
    // and keep the channelId
    // for the new channel that holds those old messages.
    // It would function like a linkedList:
    //     CurrentChannel <10k -> 2ndChannel 10k -> 3rdChannel 10k.
    // The 2nd Channel and 3rd Channel Ids would only be privy
    // to the currentChannel.
    // When the router recieves this request, it will return all
    // the messages associated with that channelId.
});

// Adds a message to the channel's List.
// params: channelName(String).
// body: channelId(MongoId), username(string), and message(string).
// return: json is returned with 200 if true
// or 404 and status as false if false.
router.post('/addMessage/:channelName', async (req, res) => {
    try {
        let channelId = req.body.channelId;
        if (!mongoIdVerify(channelId)) throw new Error('channelId not MongoId');
        let message = req.body.message;
        await messagesServices.createMessage(
            channelId, res.locals.username, message);
        res.status(200).json({status: true});
    } catch (e) {
        res.status(404).json({status: false});
    }
});

// Adds a friend to the channel by user.
// params: channelName(String).
// body: channelId(MongoId) and channelName(string).
// return: json is returned with 200 if true 
// or 404 and status as false if false.
router.post('/addFriend/:channelName', async (req, res) => {
    let channelId = req.body.channelId;
    try {
        await userServices.addPersonToChannel(
            channelId, req.param.channelName, res.locals.id
        );
        res.status(200).json({status: true});
    } catch (e) {
        console.error(e);
        res.status(404).json({status: false});
    }
});

export default router;
