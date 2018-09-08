"use strict";

var _jwtauth = _interopRequireDefault(require("./jwtauth.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let user = {
  username: 'Chris',
  email: 'email@gmail.com'
};
let date = Date.now();
let expDate = date + 1000 * 600;

let token = _jwtauth.default.jwtGenerate(user, expDate, date, 'password');

console.log(token);

let verify = _jwtauth.default.jwtVerify(token, 'password2');

console.log(verify); // jwtGenerate(user, expDate, date, 'password');