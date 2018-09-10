import http from 'http';
import mongoose from 'mongoose';
import app from '../server.js';
import log from '../config.js';
import credentials from '../../../secretUsernamePassword.js';


// This establishes the logging I will be using over this project,
// which is bunyan.
const logger = log.log;

let d = new Date(Date.now());

const url = `mongodb://${credentials.mongoUsername}:${credentials.mongoPassword}@ds239692.mlab.com:39692/slack_clone`;

mongoose.connect(url, {useNewUrlParser: true}, () =>
    logger.info(`Database Connected on Date: ${d.toDateString()} 
    Time: ${d.toTimeString()}`));

app.set('PORT', process.env.port || 5000);

let port = app.get('PORT');

// TODO:
// At somepoint make this run a https server.
const server = http.createServer(app);

server.listen(port);

server.on('error', (err) => logger.error(err));
server.on('listening', () => logger.info(
    `Listening on PORT ${port}.`));


