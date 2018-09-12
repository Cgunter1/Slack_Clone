// This will be the api that will serve the messages from the MongoDB database.
import express from 'express';
import tokenServices from '../services/tokenService';
import jwtAuth from '../user-auth/jwtauth.js';
import userServices from '../services/userServices';
import messagesServices from '../services/messagesServices';
// import bodyParser from 'body-parser';

const router = express.Router();

// TODO:
// Add Channel.
// Add Friend to channel.
// Remove Channel.

// Verifies Users before going to any of the channels.
router.use(async function(req, res, next) {
    if (!req.headers.authorization) {
        res.status(403).send('Could not verify');
    } else {
        try {
        let bearer = req.headers.authorization.split(' ');
        let token = bearer[1];
        let key = await tokenServices.findSecretKey(token);
        let verify = jwtAuth.jwtVerify(token, key);
        if (verify) {
            res.locals.id = verify.id;
            next();
        } else {
            res.status(403).send('Could not verify');
        }
        } catch (e) {
            res.status(403).send('Could not verify');
        }
    }
});

router.get('/:channelName', async (req, res) => {
    // Parameters: channelId, count(optional), and userId.
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

router.post('/:channelId', (req, res) => {
    // The information is checked with the userId to make sure that is correct through auth0.
    // The post body is given with the userId, message, timestamp.
    // res.status(200).send(res.locals.username);
});


export default router;
