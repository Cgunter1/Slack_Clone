import express from 'express';
import bodyParser from 'body-parser';
import messageRouter from './api/message_api.js';
import log from './config.js';
import credentials from '../../secretUsernamePassword.js';
import mongoose from 'mongoose';

const url = `mongodb://${credentials.username}:${credentials.password}@ds239692.mlab.com:39692/slack_clone`;

const logger = log.log;

mongoose.connect(url, () => console.log('Database Connected!'));

const app = express();
// Body Parser allows for req body.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.set('PORT', process.env.port || 5000);


app.use((req, res, next) => {
  logger.info(`${req.method} Request of ${req.url} and Body: ${req.headers}`);
  next();
});

app.get('/', (req, res) => {
    res.send('[{}]');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.end('Thanks');
});

app.use('/message', messageRouter);

app.listen(app.get('PORT'), () => {
    console.log(`Running on Port ${app.get('PORT')}.`);
});
