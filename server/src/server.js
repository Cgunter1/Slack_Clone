import express from 'express';
import bodyParser from 'body-parser';
// import messageRouter from './api/message_api.js';
import userRouter from './api/user_api.js';
import channelRouter from './api/channel_api.js';
import log from './config.js';
import credentials from '../../secretUsernamePassword.js';
import mongoose from 'mongoose';

console.log(credentials.mongoUsername);

// This is the link to the Slack Clone's Mongo Database. The username
// and password are on a different file, so no peeking...
const url = `mongodb://${credentials.mongoUsername}:${credentials.mongoPassword}@ds239692.mlab.com:39692/slack_clone`;

// This establishes the logging I will be using over this project,
// which is bunyan.
const logger = log.log;

mongoose.connect(url, () => console.log('Database Connected!'));

const app = express();
// Body Parser allows for req body.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.set('PORT', process.env.port || 5000);

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

app.listen(app.get('PORT'), () => {
    console.log(`Running on Port ${app.get('PORT')}.`);
});
