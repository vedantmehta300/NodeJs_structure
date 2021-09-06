const UserModel = require('./userModel')
const {log4js} = require('../../services/logger')
const log = log4js.getLogger("User.DAL")

async function create(data) {
    try {
        return await UserModel.create(data)
    } catch (e) {
        log.error("create ", e)
        throw  e
    }
}

async function findUser(query, selection) {
    try {
        return await UserModel.find(query)
    } catch (e) {
        log.error("findUser ", e)
        throw  e
    }
}
async function findUserPaginate(query, option) {
    try {
        return await UserModel.paginate(query,option)
    } catch (e) {
        log.error("findUserPaginate ", e)
        throw  e
    }
}
async function findById(id) {
    try {
        return await UserModel.findById(id)
    } catch (e) {
        log.error("findById ", e)
        throw  e
    }
}

async function deleteById(id) {
    try {
        return await UserModel.findByIdAndDelete(id)
    } catch (e) {
        log.error("deleteById ", e)
        throw  e
    }
}

async function updateById(id,data) {
    try {
        return await UserModel.findByIdAndUpdate(id,data)
    } catch (e) {
        log.error("updateById ", e)
        throw  e
    }
}

async function distinctUser(field, query){
    try {
        return await UserModel.distinct(field, query)
    } catch (e) {
        log.error("updateById ", e)
        throw  e
    }
}

module.exports = {
    create,
    findUser,
    findById,
    updateById,
    findUserPaginate,
    deleteById,
    distinctUser
}
