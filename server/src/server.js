import express from 'express';

const app = express();

// app.use(express.json());

app.set('PORT', process.env.port || 5000);


app.get('/', (req, res) => {
    res.sends("[{}]");
});

app.listen(app.use('PORT'), () => {
    console.log(`Running on Port ${app.use('PORT')}.`);
});