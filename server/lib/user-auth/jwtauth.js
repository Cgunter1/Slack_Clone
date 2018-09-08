"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _uuid = _interopRequireDefault(require("uuid"));

var _sha = _interopRequireDefault(require("sha256"));

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let client = _config.default.redisClient;
const JWT_HASHING_ALG = _config.default.jwt.hashAlg; // Generate new JSON Web Token.

function jwtGenerate(user, expireDate, issuedAt, secretKey) {
  let jPayload = {
    name: user.username,
    iat: issuedAt,
    jti: (0, _sha.default)(issuedAt + user.email),
    exp: expireDate
  };

  let token = _jsonwebtoken.default.sign(jPayload, 'password');

  return token;
} // Verifies the JSON Web Token with the secret key.


function jwtVerify(token, secretKey) {
  try {
    let isValid = _jsonwebtoken.default.verify(token, secretKey);

    return true;
  } catch (e) {
    return false;
  }
}

var _default = {
  jwtGenerate,
  jwtVerify
};
exports.default = _default;