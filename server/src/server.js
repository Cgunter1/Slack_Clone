import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import userRouter from './api/user_api.js';
import channelRouter from './api/channel_api.js';
import log from './config.js';


const logger = log.log;

// TODO:
// Remember after being finished with all the routes to
// put the entire server under HTTPS!!!!!!

// This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...
const app = express();
// Body Parser allows for req body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Extra Protection for the api endpoints.
app.use(helmet());


// Makes sure to always log the request, url, and header on every request to
// the server.
app.use((req, res, next) => {
    logger.info(`${req.method} Request of ${req.url} and Body: ${req.headers}`);
    next();
});


// For any urls that are /channel or /user
app.use('/user', userRouter);
app.use('/channel', channelRouter);

// If it is not in the message router or user router
// then it is an erroneous error.
app.all('*', (req, res) => {
    res.status(404).send('Sorry can\'t find that!');
});

export default app;
