const TopicModel = require('./topic.model');
const {log4js} = require('../../../services/logger');
const log = log4js.getLogger("topic.DAL");

async function topicCreate(data) {
    try {
        return await TopicModel.create(data)
    } catch (e) {
        log.error("create ", e);
        throw  e
    }
}

async function findTopic(query, selection) {
    try {
        if(selection){
            return await TopicModel.find(query).select(selection)
        }
        return await TopicModel.find(query)
    } catch (e) {
        log.error("findTopic ", e);
        throw  e
    }
}

async function findTopicPaginated(query, option) {
    try {
        return await TopicModel.paginate(query,option)
    } catch (e) {
        log.error("findTopicPaginated ", e);
        throw  e
    }
}

async function topicFindById(id) {
    try {
        return await TopicModel.findById(id)
    } catch (e) {
        log.error("topicFindById ", e);
        throw  e
    }
}

async function topicFindOne(query) {
    try {
        return await TopicModel.findOne(query)
    } catch (e) {
        log.error("topicFindById ", e);
        throw  e
    }
}

async function topicDeleteById(id) {
    try {
        return await TopicModel.findByIdAndDelete(id)
    } catch (e) {
        log.error("topicDeleteById ", e);
        throw  e
    }
}

async function deleteTopic(query) {
    try {
        return await TopicModel.deleteMany(query);
    } catch (e) {
        log.error("deleteTopic ", e);
        throw  e
    }
}

async function topicUpdateById(id,data,option) {
    try {
        return await TopicModel.findByIdAndUpdate(id,data,option)
    } catch (e) {
        log.error("topicUpdateById ", e);
        throw  e
    }
}

async function topicUpdate(query, updateObject, options) {
    try {
        return await TopicModel.findOneAndUpdate(query, updateObject, options)
    } catch (e) {
        log.error("topicUpdate ", e);
        throw  e
    }
}



module.exports = {
    topicCreate,
    topicUpdate,
    topicUpdateById,
    topicFindOne,
    topicDeleteById,
    topicFindById,
    findTopicPaginated,
    findTopic,
    deleteTopic
}
