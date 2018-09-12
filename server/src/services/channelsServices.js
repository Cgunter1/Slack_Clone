/* eslint-disable */
import channelSchema from '../models/channelModel.js';
import userSchema from './userServices.js';
import logger from '../config.js';
/* eslint-enable */


let log = logger.log;

/**
 * Add channel from user. This creates a new channel and
 * adds it to the ownership of the user.
 * @param {string} userName Name of the user that is creating the channel.
 * @param {number} userId Id of the user that is adding the new channel.
 * @param {string} channelName Name of the channel that is being added.
 * @param {boolean} isFriendChannel Bool that represents the type of channel.
 * @return {object} The new Object of the channel or an error object.
 */
async function createChannel(userName, userId, channelName, isFriendChannel) {
    try {
        /* eslint-disable */
        let channel = new channelSchema({
            name: channelName,
            members: 1
        });
        /* eslint-enable */
        let newChannel = await channel.save();
        // Update channel to the user collection.
        if (!isFriendChannel) {
            await userSchema.addChannel(channel.name, channel._id, userId);
        }
        return newChannel;
    } catch (e) {
        log.error(e);
        return e;
    }
}

/**
 * Get channel from channel objectId.
 * @param {number} channelId Name of the user that is creating the channel.
 * @return {object} The Object will be the channel returned or an error.
 */
async function getChannel(channelId) {
    try {
        let channelRequest = await channelSchema.findOne({
            _id: channelId,
        });
        return channelRequest;
    } catch (e) {
        log.error(e);
        return e;
    }
}

// TODO:
// Remember to delete all the messages when a channel is deleted.
/**
 * Deletes channel from channel objectId.
 * It recieves a channelId and a userId for the one deleting it.
 * If it's the person removing the channel is the last one, the channel
 * is then removed by itself. Otherwise, the member of the channel is
 * subtracted by 1. If the channel is between 2 friends (shown with
 * friendChannel), the channel is deleted outright.
 * @param {number} userId Name of the user that is removing the channel.
 * @param {number} channelId Id of the channel that is being removed.
 * @param {number} friendChannel Name of the user that is creating the channel.
 * @return {object} The Object will be the channel removed, null, or an error.
 */
async function removeChannel(userId, channelId, friendChannel) {
    try {
        let response = null;
        if (friendChannel) {
            return await channelSchema.deleteOne({
                _id: channelId,
            });
        }
        await userSchema.removeChannel(userId, channelId, friendChannel);
        let channel = await getChannel(channelId);
        if (channel !== null && channel.members === 0) {
            response = await channelSchema.deleteOne({
                _id: channelId,
            });
        }
        return response;
    } catch (e) {
        log.error(e);
        return e;
    }
}

export default {
    createChannel,
    getChannel,
    removeChannel,
};
