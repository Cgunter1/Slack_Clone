"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _message_api = _interopRequireDefault(require("./message_api.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)(); // Body Parser allows for req body.

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.set('PORT', process.env.port || 5000);
app.get('/', (req, res) => {
  res.send('[{}]');
});
app.post('/', (req, res) => {
  console.log(req.body);
  res.end('Thanks');
});
app.use('/message', _message_api.default);
app.listen(app.get('PORT'), () => {
  console.log(`Running on Port ${app.get('PORT')}.`);
});