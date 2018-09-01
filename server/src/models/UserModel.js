import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

const userSchema = mongoose.schema({
    username: String,
    password: String,
    email: String,
    timestamps: {createdAt: 'created_at', updatedAt: 'update_at'},
});

userSchema.pre('save', async function(next) {
  const user = this;
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    return bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      return next();
    });
  });
});

userSchema.methods.comparePasswords = function(possiblePassword, cb) {
    bcrypt.compare(possiblePassword, this.password, function(err, res) {
        if (err) {
            console.error(err);
        } else {
            cb(res);
        }
    });
};

export default userSchema;
