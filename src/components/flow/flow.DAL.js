const flowModel = require('./flow.model');
const {log4js} = require('../../services/logger')
const log = log4js.getLogger("FLow.DAL")
const stepModel = require('./flow-step/flow-step.model')
async function create(data) {
    try {
        return await flowModel.create(data)
    } catch (e) {
        log.error("Create", e)
        throw e

    }
}

async function findFlow(query, populate) {
    try {
        if (populate) {
            return await flowModel.findOne(query).populate('steps')
        }
        return await flowModel.findOne(query)
    } catch (e) {
        log.error("findFlow", e)
        throw e

    }
}
async function find(query, option) {
    try {
        if (option) {
            return await flowModel.find(query).select(option)
        }
        return await flowModel.find(query)
    } catch (e) {
        log.error("findFlow", e)
        throw e

    }
}
async function flowPaginate(query,option){
    try {
        return await flowModel.paginate(query,option)
    } catch (e) {
        log.error("findFlow", e)
        throw e

    }
}
async function findOneAndUpdate(query,updateQuery,option){
    try {
        return await flowModel.findOneAndUpdate(query,updateQuery,option)
    } catch (e) {
        log.error("findOneAndUpdate", e)
        throw e

    }
}
async function findOneAndDelete(query){
    try {
        return await flowModel.findByIdAndDelete(query)
    } catch (e) {
        log.error("findOneAndDelete", e)
        throw e

    }
}
module.exports = {
    create,
    findFlow,
    flowPaginate,
    findOneAndUpdate,
    findOneAndDelete,
    find
}
