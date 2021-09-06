const {createSuccessfullyResponse} = require("../../../helper/successResponse.helper");
const {generateUnhandledRequest} = require("../../../helper/errorHandler.helper");
const {generateBadRequest} = require("../../../helper/errorHandler.helper");
const {NULL_SHING_VALUE, isInvalidObjectId} = require("../../../helper/common.helper");
const topicDb= require("./topic.DAL");
const quizDb= require("../quiz/quiz.Dal");
const videoDb= require("../video/video.Dal");
const subjectDb = require("../subject.DAL");
const {log4js} = require('../../../services/logger');
const log = log4js.getLogger("topic.controller");

/**
 * Creates topic
 */
async function createTopic(req, res) {
    try {
        const {name,subjectId,flowId} = req.body;
        const createdBy = req.user._id;
        if(NULL_SHING_VALUE.includes(name) || isInvalidObjectId(subjectId)){
            throw await generateBadRequest("the request missing some importance fields to create topic")
        }
        const topic = await topicDb.topicFindOne({name,subjectId});
        if(topic){
            throw await generateBadRequest("Topic found with same name ")
        }
        const newTopic = {
            name,
            subjectId,
            flowId,
            createdBy
        };
        const newTopicData = await topicDb.topicCreate(newTopic);
        await subjectDb.updateSubjectById(subjectId, { $push: { topic: newTopicData._id} }, {new:true});
        const successResponse = await createSuccessfullyResponse("Topic created successfully", newTopicData, "TOPIC_CREATE");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("createTopic unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest();
        return res.status(e.statusCode).json(exception)
    }
}

/**
 * Update topic
 */
async function updateTopic(req, res) {
    try {
        const { topicId } = req.params;

        if (isInvalidObjectId(topicId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        const topic = await topicDb.topicFindOne({_id:{$ne:topicId},name:req.body.name,subjectId:req.body.subjectId});
        if(topic){
            throw await generateBadRequest("Topic found with same name ")
        }
        const updatedTopic =await topicDb.topicUpdateById(topicId,req.body, {new: true});
        const successResponse = await createSuccessfullyResponse("Topic updated successfully", updatedTopic, "TOPIC_UPDATED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("updateTopic unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * delete topic
 */
async function deleteTopic(req, res) {
    try {
        const { topicId } = req.params;

        if (isInvalidObjectId(topicId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const promiseArray =[];
         promiseArray.push(topicDb.topicDeleteById(topicId));
         promiseArray.push(subjectDb.updateSubject({topic:topicId}, { $pull: { topic: topicId} }, {new:true}));
         promiseArray.push(quizDb.quizDeleteMany({topicId}));
         promiseArray.push(videoDb.videoDeleteMany({topicId}));

         await Promise.all(promiseArray);

        const successResponse = await createSuccessfullyResponse("Topic deleted successfully", {},"TOPIC_DELETED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("deleteTopic unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * get topic by Id
 */
async function getTopic(req, res) {
    try {
        const { topicId } = req.params;

        if (isInvalidObjectId(topicId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const topic = await topicDb.topicFindById(topicId);

        if(!topic){
            throw await generateBadRequest("Topic not found ")
        }
        const successResponse = await createSuccessfullyResponse("Topic fetched successfully", topic, "TOPIC_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getTopic unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * get topic by subjectId
 */
async function getSubjectTopic(req, res) {
    try {
        const { subjectId } = req.params;

        const { page,limit,searchParam} = req.query;

        const options= {
            page:parseInt(page,10)||1,
            limit:parseInt(limit,10)||10,
            sort: {
                createdAt: 'desc',
            },
        };

        if (isInvalidObjectId(subjectId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        let query = { subjectId };

        if (!NULL_SHING_VALUE.includes(searchParam)) {
            query.name = {$regex: searchParam, $options: 'i'};
        }
        const topicData = await topicDb.findTopicPaginated(query,options);

        const successResponse = await createSuccessfullyResponse("Subject topic fetched successfully", topicData, "SUBJECT_TOPIC_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getSubjectTopic unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * Get topics
 */
 async function getTopics(req,res){
    try {
        const { subjectId }=req.params
        const topics =await topicDb.findTopic({subjectId})
        if(!topics){
            throw await generateBadRequest("Topics not found ")
        }
        const successResponse = await createSuccessfullyResponse("Topic fetched successfully", topics, "TOPICS_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getTopics  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while get Topics ');
        return res.status(e.statusCode).json(exception)
    }
};

module.exports = {
    createTopic,
    updateTopic,
    deleteTopic,
    getTopic,
    getSubjectTopic,
    getTopics
};
