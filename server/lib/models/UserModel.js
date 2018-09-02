"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is the salt that will be used with the bcrypt function
// and password to create a hash.
const SALT_FACTOR = 10; // This is the schema for the user collection of the MongoDB.

const userSchema = _mongoose.default.schema({
  username: String,
  password: String,
  email: String,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'update_at'
  }
}); // This remembers to hash the password with bcrypt before
// saving the user password to the Mongo Database.


userSchema.pre('save', async function (next) {
  const user = this;

  _bcrypt.default.genSalt(SALT_FACTOR, function (err, salt) {
    return _bcrypt.default.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      return next();
    });
  });
}); // Adds the comparePasswords method to the schema, so it is accessible
// to compare the passwords without headache.

userSchema.methods.comparePasswords = function (possiblePassword, cb) {
  _bcrypt.default.compare(possiblePassword, this.password, function (err, res) {
    if (err) {
      console.error(err);
    } else {
      cb(res);
    }
  });
};

var _default = userSchema;
exports.default = _default;