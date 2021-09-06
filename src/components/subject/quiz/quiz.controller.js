const {createSuccessfullyResponse} = require("../../../helper/successResponse.helper");
const {generateUnhandledRequest} = require("../../../helper/errorHandler.helper");
const {generateBadRequest} = require("../../../helper/errorHandler.helper");
const {NULL_SHING_VALUE, isInvalidObjectId} = require("../../../helper/common.helper");
const quizDb = require("./quiz.Dal");
const {log4js} = require('../../../services/logger');
const log = log4js.getLogger("quiz.controller");

/**
 * Creates quiz
 */
async function createQuiz(req, res) {
    try {
        const {topicId} = req.params;

        const {name, question, correctAnswer, options, marks, timeLimit,subjectId} = req.body;

        const createdBy = req.user._id;

        if (
            NULL_SHING_VALUE.includes(name) ||
            NULL_SHING_VALUE.includes(question) ||
            NULL_SHING_VALUE.includes(correctAnswer) ||
            NULL_SHING_VALUE.includes(options) ||
            NULL_SHING_VALUE.includes(marks) ||
            isInvalidObjectId(subjectId) ||
            isInvalidObjectId(topicId)) {
            throw await generateBadRequest("the request missing some importance fields to create quiz")
        }

        const newQuiz = {
            name,
            question,
            correctAnswer,
            options,
            marks,
            timeLimit,
            createdBy,
            topicId,
            subjectId
        };
        const newQuizData = await quizDb.quizCreate(newQuiz);

        const successResponse = await createSuccessfullyResponse("Quiz created successfully", newQuizData, "QUIZ_CREATE");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("createQuiz unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest();
        return res.status(e.statusCode).json(exception)
    }
}

/**
 * Update quiz
 */
async function updateQuiz(req, res) {
    try {
        const {quizId} = req.params;

        if (isInvalidObjectId(quizId)) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const updatedQuiz = await quizDb.quizUpdateById(quizId, req.body, {new: true});

        const successResponse = await createSuccessfullyResponse("Quiz updated successfully", updatedQuiz, "QUIZ_UPDATED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("updateQuiz unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * delete quiz
 */
async function deleteQuiz(req, res) {
    try {
        const {quizId} = req.params;

        if (isInvalidObjectId(quizId)) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        await quizDb.quizDeleteById(quizId);

        const successResponse = await createSuccessfullyResponse("Quiz deleted successfully", {}, "QUIZ_DELETED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("deleteQuiz unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * get quiz by Id
 */
async function getQuiz(req, res) {
    try {
        const {quizId} = req.params;

        if (isInvalidObjectId(quizId)) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const quiz = await quizDb.quizFindById(quizId);

        if (!quiz) {
            throw await generateBadRequest("Quiz not found ")
        }
        const successResponse = await createSuccessfullyResponse("Quiz fetched successfully", quiz, "QUIZ_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getQuiz unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * get quiz by subjectId
 */
async function getTopicQuiz(req, res) {
    try {
        const {topicId} = req.params;

        const {page, limit, searchParam} = req.query;

        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: {
                createdAt: 'desc',
            },
        };

        if (isInvalidObjectId(topicId)) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        let query = {topicId};

        if (!NULL_SHING_VALUE.includes(searchParam)) {
            query.name = {$regex: searchParam, $options: 'i'};
        }
        const quizData = await quizDb.findQuizPaginated(query, options);

        const successResponse = await createSuccessfullyResponse("Topic quiz fetched successfully", quizData, "TOPIC_QUIZ_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getTopicQuiz unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

async function getAllQuiz(req, res) {
    try {
        const {topicId} = req.params;


        if (isInvalidObjectId(topicId)) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const quizData = await quizDb.findQuiz({topicId});

        const successResponse = await createSuccessfullyResponse("Topic quiz fetched successfully", quizData, "TOPIC_QUIZ_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getTopicQuiz unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * Get quiz
 */
 async function getQuizs(req,res){
    try {
        const { topicId }=req.params
        const quizs =await quizDb.findQuiz({topicId})
        if(!quizs){
            throw await generateBadRequest("Quizes not found ")
        }
        const successResponse = await createSuccessfullyResponse("Quizes fetched successfully", quizs, "QUIZS_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getQuizes  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while get quizes ');
        return res.status(e.statusCode).json(exception)
    }
};


module.exports = {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
    getAllQuiz,
    getTopicQuiz,
    getQuizs
};
