// This will be the api that will serve the messages from the MongoDB database.
import express from 'express';
// import bodyParser from 'body-parser';

const router = express.Router();


router.get('/:userId/:channelId', (req, res) => {
    // When the request reaches the database api, the api
    // checks if the id given and any of the other user ids of the conversation
    // are the same. If they aren't, it fails.
});

router.post('/user/:userId/:channelId', (req, res) => {
    // The information is checked with the userId to make sure that is correct.
    // The post body is given with the userId, message, timestamp.
});

export default router;
