import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userServices from '../services/userServices';
import { appendFileSync } from 'fs';

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
  /* eslint-disable */
    const user = this;
  /* eslint-enable */
    if (!user.isModified('password')) return next();
    return bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        return bcrypt.hash(user.password, salt,
            function(err, hash) {
                user.password = hash;
                return next();
        });
    });
});

// Adds the comparePasswords method to the schema, so it is accessible
// to compare the passwords without headache.
// userSchema.methods.comparePasswords = async function(username, possiblePassword) {
//     try {
//     let user = await userServices.findUser('name', username);
//     console.log(possiblePassword);
//     console.log(user.password);
//     return await bcrypt.compare(possiblePassword, user.password,
//         async function(e, res) {
//         console.log(res);
//         if (e) {
//             console.error(e);
//             return new Error(e);
//         } else {
//             return res;
//         }
//     });
//     } catch (e) {
//         console.error(e);
//         return new Error(e);
//     }
// };

export default mongoose.model('User', userSchema);
