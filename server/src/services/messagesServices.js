/* eslint-disable */
import messageSchema from '../models/MessageModel.js';
import channelServices from './channelsServices.js';
import logger from '../config.js';
/* eslint-enable */

let log = logger.log;

/**
 * Find messages by channelId.
 * @param {number} channelId Id of the channel that the messages belong to.
 * @return {array} Returns message Array.
 */
async function findMessages(channelId) {
    try {
        let messages = await messageSchema.find({channel_id: channelId});
        return messages;
    } catch (e) {
        log.error(e);
    }
}

/**
 * Creates Message on channel_id.
 * @param {number} channelId Id of the channel that the new message belongs to.
 * @param {string} userName Name of the user that submitted the message.
 * @param {string} message Contents of the message.
 */
async function createMessage(channelId, userName, message) {
    try {
        /* eslint-disable */
        let messages = new messageSchema({
        /* eslint-enable */
            channel_id: channelId,
            username: userName,
            message: message,
            date: Date.now(),
        });
        await messages.save();
        // Updates the time of the channel last written to.
        let channel = await channelServices.getChannel(channelId);
        channel.date = Date.now();
        await channel.save();
    } catch (e) {
        log.error(e);
    }
}

/**
 * Delete messages by message_id.
 * @param {number} messageId is the id of the message that is going
 * to be deleted.
*/
async function removeMessage(messageId) {
    try {
        await messageSchema.deleteOne({_id: messageId});
    } catch (e) {
        log.error(e);
    }
}

export default {
    findMessages,
    createMessage,
    removeMessage,
};
