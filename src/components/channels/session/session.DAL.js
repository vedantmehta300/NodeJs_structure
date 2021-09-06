const SessionModel = require('./session.model')
const {log4js} = require('../../../services/logger')
const log = log4js.getLogger("Session.DAL")

async function get({studentId}) {
    try {
        let session = await SessionModel.findOne({studentId});
        if (!session) {
            session = await SessionModel.create({studentId})
            session.conversion = {}
        }
        if (session.conversion && typeof session.conversion === 'string') {
            try {
                session.conversion = JSON.parse(session.conversion)
            } catch (e) {
                log.warn("Error in parse JSON")
            }
        }
        return session
    } catch (e) {
        log.error("get ", e)
        throw "Error in get"
    }
}

async function set({query, conversion}) {
    try {
        return await SessionModel.findOneAndUpdate(query, {$set: {conversion}})
    } catch (e) {
        log.error("get ", e)
        throw "Error in get"
    }
}

module.exports = {
    set, get
}
