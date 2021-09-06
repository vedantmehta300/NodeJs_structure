const {log} = require('../../services/logger')

async function getRequestFromChannel(req, res) {
    try {
        log.debug("getRequestFromChannel method call.",req.body)
        const channel = req.params.channel
        switch (channel){
            case 'facebook':
                break;
        }
    } catch (e) {
        log.error("getRequestFromChannel:", e)
    }
}

module.exports = {
    getRequestFromChannel,
};
