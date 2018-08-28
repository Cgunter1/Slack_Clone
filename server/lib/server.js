"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)(); // app.use(express.json());

app.set('PORT', process.env.port || 5000);
app.get('/', (req, res) => {
  res.send("[{}]");
});
app.listen(app.get('PORT'), () => {
  console.log(`Running on Port ${app.get('PORT')}.`);
});