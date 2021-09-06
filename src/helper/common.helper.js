const {log4js} = require('../services/logger')
const ObjectId = require('mongoose').Types.ObjectId;
const log = log4js.getLogger("common.helper")
const NULL_SHING_VALUE = [null, undefined, '']
const path = require('path')
const fs = require('fs');
    function checkMongooseId(id) {
    return !ObjectId.isValid(id)
}
function checkMediaAndCreateFolder() {
    try {
        const mediaPath = path.join(__dirname, "../../media");
        if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath)
        }
        const sheetPath = path.join(mediaPath, 'sheets');
        if (!fs.existsSync(sheetPath)) {
            fs.mkdirSync(sheetPath)
        }

        const videoPath = path.join(mediaPath, 'video');
        if (!fs.existsSync(videoPath)) {
            fs.mkdirSync(videoPath)
        }
        log.info("Default media folder created.")
    } catch (e) {
        log.error("checkMediaAndCreateFolder in create folder",e)
    }
}


function isInvalidObjectId(...ObjectIds) {
    // for all arguments; if any one of the argument is invalid then function will return true (= invalid id found)
    return !ObjectIds.every(objectId => ObjectId.isValid(objectId));
}
module.exports = {
    NULL_SHING_VALUE,
    checkMediaAndCreateFolder,
    checkMongooseId,
    isInvalidObjectId
}
