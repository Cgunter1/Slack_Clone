// This will be the api that will serve the messages from the MongoDB database.
import express from 'express';
// import bodyParser from 'body-parser';

const router = express.Router();

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
router.post('/updatePassword_Questions_PhoneNumber', (req, res) => {
    
});

// After that, create a token on the database that
// will expire after a day. The token will be sent
// either through SMS or email using Twilio.
router.post('/updatePassword_token', (req, res) => {
    
});

// This route creates the user.
// Accepts username, email, and password.
// Eventually, phoneNumber and security questions.
router.post('/newUser', (req, res) => {
    // Body will include the username, email, and password for now.
    // A new user will then be created from that information and logged
    // to log.info.
    // The information is checked with the userId to make sure that is correct.
    // The post body is given with the userId, message, timestamp.
});

export default router;
