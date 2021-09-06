const path = require('path');
const fs = require('fs');
const config = require('../../../configuration/config');
const {log4js} = require('../../../services/logger');
const log = log4js.getLogger("video.helper");


const removeFile = async (url)=>{
    const filePath = url.split(config.server.BASE_URL)[1];
    const fileToDelete = path.join(__dirname, `../../../../media/${filePath}`);
    if (fs.existsSync(fileToDelete)) {
        try {
            fs.unlinkSync(fileToDelete);
            log.info(`removeFile : deleted `, url);
            // file removed
        } catch (err) {
            log.error(`removeFile  : error removing file ${url}`, err);
        }
    }
};


module.exports = {
    removeFile
};

