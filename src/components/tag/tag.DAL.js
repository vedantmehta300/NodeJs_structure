const Tag=require('./tag.model')
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("tag.DAL");

async function create(data){
    try {
        return await Tag.create(data)
    } catch (e) {
        log.error("createTag", e);
        throw e
    }
}

async function findTag(){
    try {
        return await Tag.find()

    } catch (e) {
        log.error("findTag", e);
        throw e


    }
}
async function findOneTag(id){
    try {
        return await Tag.findOne(id)
    }catch (e) {
        log.error("findOneTag", e);
        throw e

    }
}
async function deleteTagById(id){
    try {
        return await Tag.findByIdAndDelete(id)
    } catch (e) {
        log.error("deleteTag", e);
        throw e
    }
}

async function updateTagById(id,updatedata,options){
    try {
        return await Tag.findByIdAndUpdate(id,updatedata,options);
    } catch (e) {
        log.error("updateTagById", e)
        throw e

    }
}

async function updateTag(query,updatedata,options){
    try {
        return await Tag.findOneAndUpdate(query,updatedata,options);
    } catch (e) {
        log.error("updateTag", e)
        throw e
    }
}

module.exports={
    create,
    findTag,
    findOneTag,
    deleteTagById,
    updateTagById,
    updateTag,
};
