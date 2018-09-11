"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _sha = _interopRequireDefault(require("sha256"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import uuid from 'uuid';
// import config from '../config.js';
// let client = config.redisClient;
// const JWT_HASHING_ALG = config.jwt.hashAlg;
// Generate new JSON Web Token.

/**
 * Add two numbers.
 * @param {object} user The user.
 * @param {number} expireDate The expire date.
 * @param {number} issuedAt The date jwt created.
 * @param {string} secretKey The secret string.
 * @return {string} Returns the generated Json Web Token.
 */
function jwtGenerate(user, expireDate, issuedAt, secretKey) {
  let jPayload = {
    name: user.username,
    id: user.id,
    iat: issuedAt,
    jti: (0, _sha.default)(issuedAt + user.email),
    exp: expireDate
  };

  let token = _jsonwebtoken.default.sign(jPayload, secretKey);

  return token;
} // Verifies the JSON Web Token with the secret key.

/**
 * Add two numbers.
 * @param {string} token The jwt.
 * @param {string} secretKey The secret key decoder.
 * @return {boolean} If the token and secretKey is valid.
 */


function jwtVerify(token, secretKey) {
  try {
    return _jsonwebtoken.default.verify(token, secretKey);
  } catch (e) {
    return e;
  }
}

var _default = {
  jwtGenerate,
  jwtVerify
};
exports.default = _default;