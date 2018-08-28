"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _message_api = _interopRequireDefault(require("./message_api.js"));

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = _config.default.log;
const app = (0, _express.default)(); // Body Parser allows for req body.

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
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
app.use('/message', _message_api.default);
app.listen(app.get('PORT'), () => {
  console.log(`Running on Port ${app.get('PORT')}.`);
});