const {log4js} = require('../../services/logger');
const log = log4js.getLogger("transcript.Dal");
const TranscriptModel = require('./transcript.model');

async function create(transcript) {
    try {
        await TranscriptModel.create(transcript)
    } catch (e) {
        log.error("Create message", e)
    }
}

async function get({botUserId}) {
    try {
        return await TranscriptModel.find({ botUserId })
    } catch (e) {
        log.error("get transcript", e)
    }
}

module.exports = {
    create,
    get
};
