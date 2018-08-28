import express from 'express';
import bodyParser from 'body-parser';
import messageRouter from './message_api.js';

const app = express();
// Body Parser allows for req body.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.set('PORT', process.env.port || 5000);


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
