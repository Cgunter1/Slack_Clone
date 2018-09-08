import jwt from 'jsonwebtoken';
// import uuid from 'uuid';
import sha256 from 'sha256';
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
    iat: issuedAt,
    jti: sha256(issuedAt + user.email),
    exp: expireDate,
  };
  let token = jwt.sign(jPayload, 'password');
  return token;
}

// Verifies the JSON Web Token with the secret key.
/**
 * Add two numbers.
 * @param {string} token The jwt.
 * @param {string} secretKey The secret key decoder.
 * @return {boolean} If the token and secretKey is valid.
 */
function jwtVerify(token, secretKey) {
    try {
    jwt.verify(token, secretKey);
        return true;
    } catch (e) {
        return false;
    }
}

export default {
    jwtGenerate,
    jwtVerify,
};
