const dbSubject=require('./subject.DAL');
const {generateUnhandledRequest, generateBadRequest} = require('../../helper/errorHandler.helper');
const {createSuccessfullyResponse} = require('../../helper/successResponse.helper');
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("subject.controller");
const {NULL_SHING_VALUE, isInvalidObjectId} = require("../../helper/common.helper");
const topicDb= require("./topics/topic.DAL");
const videoDb=require('./video/video.Dal');
const quizDb=require('./quiz/quiz.Dal');


/**
 * Creates subject
 */
async function createSubject(req,res) {
    try {
         const { name } = req.body;
         const createdBy = req.user._id;
         const sub= await dbSubject.subjectFindOne({name})
         if(sub){
            throw await generateBadRequest("Subject already exists")
         }

         if (NULL_SHING_VALUE.includes(name)) {
            throw await generateBadRequest("the request missing some importance fields")
          }

    const subject=await dbSubject.subjectCreate({name,createdBy});
    const successResponse = await createSuccessfullyResponse("Subject created successfully", subject, "SUBJECT_CREATE");
    res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("createSubject:   unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while  create subject');
        return res.status(e.statusCode).json(exception)
    }
};

/**
 * Update subject 
 */
async function updateSubject(req,res){
    try {
        const { subjectId } = req.params;
        const { name } = req.body;
        const sub= await dbSubject.subjectFindOne({_id:{$ne:subjectId},name})
         if(sub){
            throw await generateBadRequest("Subject already exists")
         }
        if (isInvalidObjectId(subjectId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        const subject=await dbSubject.updateSubjectById({_id:subjectId},{$set: { name }}, {new: true});
        const successResponse = await createSuccessfullyResponse("Subject update successfully", subject, "SUBJECT_UPDATED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("updateSubject  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while update subject');
        return res.status(e.statusCode).json(exception)
    }
};

/**
 * Get subject with paginate
 */
async function getSubjectWithPaginate(req,res){
    try{
        const { page,limit,searchParam} = req.query;
        const options={
            page:parseInt(page,10)||1,
            limit:parseInt(limit,10)||10,
            sort: {
                createdAt: 'desc',
            },
        };
        let query={};
        
        if (!NULL_SHING_VALUE.includes(searchParam)) {
            query.name = {$regex: searchParam, $options: 'i'};
        }
        const subjects=await dbSubject.findSubjectPaginated(query,options);
        const successResponse = await createSuccessfullyResponse("Subject fetched successfully", subjects, "SUBJECT_FETCHED_PAGINATED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("getSubjectWithPaginate  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while fetch subject');
        return res.status(e.statusCode).json(exception)
    }

};


/**
 * Get subject by id
 */

async function getSubjectById(req,res){
    try {
        const { subjectId } = req.params;
        if (isInvalidObjectId(subjectId)) {
            throw await generateBadRequest("the request missing some importance fields for get subject")
        }

        const subject=await dbSubject.findSubjectById({_id:subjectId})
        if(!subject){
            throw await generateBadRequest('subject not found')
        }
        const successResponse = await createSuccessfullyResponse("subject fetch successfully", subject, "SUBJECT_FETCH ");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getSubjectById  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while get subject ');
        return res.status(e.statusCode).json(exception)
    }

};

/**
 * Delete subject
 */
async function deleteSubject(req,res){
    try {
        const { subjectId } = req.params;
        if (isInvalidObjectId(subjectId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const subjectData = await dbSubject.subjectFindOne({_id:subjectId});

        if(!subjectData) {
            throw await generateBadRequest("Subject not found")
        }
        const promiseArray = [];
        promiseArray.push(dbSubject.deleteSubjectById({_id:subjectId}));
        promiseArray.push(topicDb.deleteTopic({subjectId}));
        promiseArray.push(videoDb.videoDeleteMany({subjectId}));
        promiseArray.push(quizDb.quizDeleteMany({topicId: {$in:subjectData.topic}}));

        await Promise.all(promiseArray);
        
        const successResponse = await createSuccessfullyResponse("Subject deleted successfully", "SUBJECT_DELETED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("deleteSubject  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while delete subject');
        return res.status(e.statusCode).json(exception)
    }
};

/**
 * Get subjects
 */
async function getSubjects(req,res){
    try {
        const subjects =await dbSubject.findSubject()
        if(!subjects){
            throw await generateBadRequest("Subjects not found ") 
        }
        const successResponse = await createSuccessfullyResponse("Subject fetched successfully", subjects, "SUBJECT_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getSubjects  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while get subjects ');
        return res.status(e.statusCode).json(exception)
    }
};


module.exports={
    getSubjects,
    getSubjectWithPaginate,
    getSubjectById,
    createSubject,
    deleteSubject,
    updateSubject
};
