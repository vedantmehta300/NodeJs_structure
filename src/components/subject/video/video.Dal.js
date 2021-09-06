const VideoModel = require('./video.model');
const {log4js} = require('../../../services/logger');
const log = log4js.getLogger("video.DAL");

async function videoCreate(data) {
    try {
        return await VideoModel.create(data)
    } catch (e) {
        log.error("create ", e);
        throw  e
    }
}

async function findVideo(query, selection) {
    try {
        if(selection){
            return await VideoModel.find(query).select(selection)
        }
        return await VideoModel.find(query)
    } catch (e) {
        log.error("findVideo ", e);
        throw  e
    }
}

async function findVideoPaginated(query, option) {
    try {
        return await VideoModel.paginate(query,option)
    } catch (e) {
        log.error("findVideoPaginated ", e);
        throw  e
    }
}

async function videoFindById(id) {
    try {
        return await VideoModel.findById(id)
    } catch (e) {
        log.error("videoFindById ", e);
        throw  e
    }
}

async function videoFindOne(query) {
    try {
        return await VideoModel.findOne(query)
    } catch (e) {
        log.error("videoFindById ", e);
        throw  e
    }
}

async function videoDeleteById(id) {
    try {
        return await VideoModel.findByIdAndDelete(id)
    } catch (e) {
        log.error("videoDeleteById ", e);
        throw  e
    }
}

async function videoUpdateById(id,data,option) {
    try {
        return await VideoModel.findByIdAndUpdate(id,data,option)
    } catch (e) {
        log.error("videoUpdateById ", e);
        throw  e
    }
}

async function videoUpdate(query, updateObject, options) {
    try {
        return await VideoModel.findOneAndUpdate(query, updateObject, options)
    } catch (e) {
        log.error("videoUpdate ", e);
        throw  e
    }
}

async function videoDeleteMany(query) {
    try {
        return await VideoModel.deleteMany(query)
    } catch (e) {
        log.error("videoDeleteById ", e);
        throw  e
    }
}


module.exports = {
    videoCreate,
    videoUpdate,
    videoUpdateById,
    videoFindOne,
    videoDeleteById,
    videoFindById,
    findVideoPaginated,
    findVideo,
    videoDeleteMany
}
