const QuizModel = require('./quiz.model');
const {log4js} = require('../../../services/logger');
const log = log4js.getLogger("quiz.DAL");

async function quizCreate(data) {
    try {
        return await QuizModel.create(data)
    } catch (e) {
        log.error("create ", e);
        throw  e
    }
}

async function findQuiz(query, selection) {
    try {
        if(selection){
            return await QuizModel.find(query).select(selection)
        }
        return await QuizModel.find(query)
    } catch (e) {
        log.error("findQuiz ", e);
        throw  e
    }
}

async function findQuizPaginated(query, option) {
    try {
        return await QuizModel.paginate(query,option)
    } catch (e) {
        log.error("findQuizPaginated ", e);
        throw  e
    }
}

async function quizFindById(id) {
    try {
        return await QuizModel.findById(id)
    } catch (e) {
        log.error("quizFindById ", e);
        throw  e
    }
}

async function quizFindOne(query) {
    try {
        return await QuizModel.findOne(query)
    } catch (e) {
        log.error("quizFindById ", e);
        throw  e
    }
}

async function quizDeleteById(id) {
    try {
        return await QuizModel.findByIdAndDelete(id)
    } catch (e) {
        log.error("quizDeleteById ", e);
        throw  e
    }
}

async function quizUpdateById(id,data,option) {
    try {
        return await QuizModel.findByIdAndUpdate(id,data,option)
    } catch (e) {
        log.error("quizUpdateById ", e);
        throw  e
    }
}

async function quizUpdate(query, updateObject, options) {
    try {
        return await QuizModel.findOneAndUpdate(query, updateObject, options)
    } catch (e) {
        log.error("quizUpdate ", e);
        throw  e
    }
}

async function quizDeleteMany(query) {
    try {
        return await QuizModel.deleteMany(query)
    } catch (e) {
        log.error("quizDeleteById ", e);
        throw  e
    }
}


module.exports = {
    quizCreate,
    quizUpdate,
    quizUpdateById,
    quizFindOne,
    quizDeleteById,
    quizFindById,
    findQuizPaginated,
    findQuiz,
    quizDeleteMany
}
