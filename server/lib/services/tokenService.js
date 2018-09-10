"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let client = _config.default.redisClient;
/**
 * Add secretKey to Redis hashtable with JWT possibly being key.
 * @param {string} secretKey Is the key that decodes the JWT and verifies.
 * @param {string} JWT Is the JSON Web Token.
 * @return {boolean} Returns true if succeeded and false if not.
 */

async function addSecretKeyToTable(secretKey, JWT) {
  return new Promise(function (resolve, reject) {
    client.set(secretKey, JWT, 'EX', 6000, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
/**
 * Find secretKey from Redis Hashtable with JWT.
 * @param {string} JWT Is the JSON Web Token.
 * @return {Promise} Returns a promise that has the
 * client secretKey if succeeded and false if not.
 */


async function findSecretKey(JWT) {
  return new Promise(function (resolve, reject) {
    client.get(JWT, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
/**
 * Remove secretKey from Redis Hashtable with JWT.
 * @param {string} JWT Is the JSON Web Token.
 * @return {Promise} Returns a promise that has the
 * returns true if succeeded and false if not.
 */


async function removeSecretKey(JWT) {
  await client.del(JWT);
}

var _default = {
  addSecretKeyToTable,
  findSecretKey,
  removeSecretKey
};
exports.default = _default;