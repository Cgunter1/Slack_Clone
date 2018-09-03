import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// This is the salt that will be used with the bcrypt function
// and password to create a hash.
const SALT_FACTOR = 10;

// This is the schema for the user collection of the MongoDB.
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    date: {
        type: Date,
        default: Date.now(),
    },
    channels: [{name: String, id: mongoose.Schema.Types.ObjectId}],
    // The channels array for are there to verify if the user has 
    // access to the other channels.
    friends: [{name: String, id: mongoose.Schema.Types.ObjectId}],
    // The friends array is there to keep track of the name of the
    // friends and the channels.
});

// This remembers to hash the password with bcrypt before
// saving the user password to the Mongo Database.
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  return bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    return bcrypt.hash(user.password, salt,
        function(err, hash) {
                user.password = hash;
                return next();
        });
    });
  }
);

// Adds the comparePasswords method to the schema, so it is accessible
// to compare the passwords without headache.
userSchema.methods.comparePasswords = function(possiblePassword, cb) {
    bcrypt.compare(possiblePassword, this.password, function(err, res) {
        if (err) {
            console.error(err);
        } else {
            cb(res);
        }
    });
};

export default mongoose.model('User', userSchema);
