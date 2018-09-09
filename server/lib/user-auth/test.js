"use strict";

var _jwtauth = _interopRequireDefault(require("./jwtauth.js"));

var _tokenService = _interopRequireDefault(require("../services/tokenService"));

var _uuid = _interopRequireDefault(require("uuid"));

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let client = _config.default.redisClient;
let user = {
  username: 'Chris',
  email: 'email@gmail.com'
};
let date = Date.now();
let expDate = date + 1000 * 600; // let key = uuid.v4();
// let token = jwtAuth.jwtGenerate(user, expDate, date, key);
// console.log(token);
// let verify = jwtAuth.jwtVerify(token, key);
// console.log(verify);

/*
* TODO:
* Write 2 tests for this in the key and jwt that
* generates jwt and puts it in
*/

async function test() {
  try {
    let secretKey = _uuid.default.v4();

    console.log(secretKey);

    let token = _jwtauth.default.jwtGenerate(user, expDate, date, secretKey);

    let result = await _tokenService.default.addSecretKeyToTable(token, secretKey);
    console.log(result);
    let retrievedKey = await _tokenService.default.findSecretKey(token);
    console.log(retrievedKey);

    let verify = _jwtauth.default.jwtVerify(token, retrievedKey);

    console.log(verify);
  } catch (e) {
    console.error(e);
  }
}

test();