// This will be the api that will serve the messages from the MongoDB database.
import express from 'express';
import isEmail from 'validator/lib/isEmail';
import trim from 'validator/lib/trim';
import emailNormalizer from 'validator/lib/normalizeEmail';
import uuid from 'uuid';
import userServices from '../services/userServices.js';
import tokenService from '../services/tokenService.js';
import log from '../config.js';
import jwtAuth from '../user-auth/jwtauth.js';

/* eslint-disable */
const router = express.Router();
/* eslint-enable */
const logger = log.log;


// TODO: 
// Logout Function.
// Add Friend.

// WARNING. V
// If either updatePassword route return danger: true,
// the database will lock the user down. It will
// log the data as a loginFailure to detect abuse.
// Then the database will put the user's timeout
// time to be 30 minutes from the login failure.

// ***************************************************

// Below is used to update the users password.
// Before returning anything, check to see if the
// date for the timeout propety has already passed.
// First ask them for the account's username.
// Ask them security questions.
// If they pass, ask them for their phone number.
    // Like for example, (***) *** -**29
router.post('/updatePassword_Questions_PhoneNumber', (req, res) => {});

// After that, create a token on the database that
// will expire after a day. The token will be sent
// either through SMS or email using Twilio.
router.post('/updatePassword_token', (req, res) => {});


// TODO:
// At Some point, add phoneNumber and Security Questions.
// This route creates the user.
// Accepts username, email, and password.
// Eventually, phoneNumber and security questions.
router.post('/createUser', async (req, res) => {
    let email = req.body.email;
    let username = req.body.username.toString();
    let password = req.body.password.toString();
    if (isEmail(email)) {
        username = trim(username);
        password = trim(password);
        email = trim(email);
        email = emailNormalizer(email);
        let date = Date.now();
        let expDate = date + (1000 * 600);
        try {
            let user = await userServices.createUser(email, username, password);
            if (user === null) {
                // Means the User already exists.
                return res.status(403).json({status: false});
            } else {
            let secretKey = uuid.v4();
            let token = jwtAuth.jwtGenerate(user, expDate, date, secretKey);
            await tokenService.addSecretKeyToTable(
                token, secretKey);
            res.status(200).json({status: true, id: user.id, token: token});
            }
        } catch (e) {
            logger.error(e);
            res.status(404).json({status: false});
        }
    } else {
        res.status(404).json({status: false});
    }
    // Body will include the username, email, and password for now.
    // A new user will then be created from that information and logged
    // to log.info.
    // The information is checked with the userId to make sure that is correct.
    // The post body is given with the userId, message, timestamp.
});

// The login will go and verify the username and password.
// If correct, it will return a jwt.
router.post('/login', async (req, res) => {
    let date = Date.now();
    let expDate = date + (1000 * 600);
    try {
        let username = req.body.username.toString();
        let password = req.body.password.toString();
        let user = await userServices.verifyUserIdentity(username, password);
        let secretKey = uuid.v4();
        let token = jwtAuth.jwtGenerate(user, expDate, date, secretKey);
        await tokenService.addSecretKeyToTable(
            token, secretKey);
        return res.status(200).json({status: true, id: user.id, token: token});
    } catch (e) {
        logger.error(e);
        res.status(404).json({status: false});
    }
});

router.post('/logout', async (req, res) => {
    if (!req.headers.authorization) {
        res.status(404).json({status: false});
    } else {
        let bearer = req.headers.authorization.split(' ');
        let token = bearer[1];
        try {
            await tokenService.removeSecretKey(token);
            res.status(200).json({status: true});
        } catch (e) {
            res.status(404).json({status: false});
        }
    }
});

export default router;
