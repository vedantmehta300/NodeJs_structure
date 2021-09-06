const {log4js} = require('../../../services/logger')
const log = log4js.getLogger("FLow-step.DAL")
const stepModel = require('./flow-step.model')
async function create(data) {
    try {
        return await stepModel.create(data)
    } catch (e) {
        log.error("Create", e)
        throw e

    }
}

async function findFlow(query, populate) {
    try {
        if (populate) {
            return await stepModel.findOne(query).populate('steps')
        }
        return await stepModel.findOne(query)
    } catch (e) {
        log.error("findFlow", e)
        throw e

    }
}
async function find(query, option) {
    try {
        if (option) {
            return await stepModel.find(query).select(option).lean(true)
        }
        return await stepModel.find(query)
    } catch (e) {
        log.error("findFlow", e)
        throw e

    }
}
async function flowPaginate(query,option){
    try {
        return await stepModel.paginate(query,option)
    } catch (e) {
        log.error("findFlow", e)
        throw e

    }
}
async function findOneAndUpdate(query,updateQuery,option){
    try {
        return await stepModel.findOneAndUpdate(query,updateQuery,option)
    } catch (e) {
        log.error("findOneAndUpdate", e)
        throw e

    }
}
async function findOneAndDelete(query){
    try {
        return await stepModel.findByIdAndDelete(query)
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
