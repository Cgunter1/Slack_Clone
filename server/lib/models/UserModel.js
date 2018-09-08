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
const SALT_FACTOR = 10;
/**
- Possibly Add Phone Number or Email, if the person forgets password.
- And Security Questions.
- Token property that will take the objectId for the token object.
- Timeout Property that keeps a data to timeout from.
    - The timeout property is to stop any reoffenders from an account.
**/
// This is the schema for the user collection of the MongoDB.

const userSchema = new _mongoose.default.Schema({
  username: String,
  password: String,
  email: String,
  date: {
    type: Date,
    default: Date.now()
  },
  channels: [{
    name: String,
    id: _mongoose.default.Schema.Types.ObjectId
  }],
  // The channels array for are there to verify if the user has
  // access to the other channels.
  friends: [{
    name: String,
    id: _mongoose.default.Schema.Types.ObjectId
  }] // The friends array is there to keep track of the name of the
  // friends and the channels.

}); // This remembers to hash the password with bcrypt before
// saving the user password to the Mongo Database.

userSchema.pre('save', function (next) {
  /* eslint-disable */
  const user = this;
  /* eslint-enable */

  if (!user.isModified('password')) return next();
  return _bcrypt.default.genSalt(SALT_FACTOR, function (err, salt) {
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

var _default = _mongoose.default.model('User', userSchema);

exports.default = _default;