const Subject=require('./subject.model')
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("subject.DAL");

async function subjectCreate(data){
    try {
        return await Subject.create(data)
    } catch (e) {
        log.error("createSubject", e);
        throw e
    }
}

async function findSubject(){
    try {
       return await Subject.find()
        
    } catch (e) {
        log.error("findSubject", e);
        throw e
    }
}

async function subjectFindOne(query) {
    try {
        return await Subject.findOne(query)
    } catch (e) {
        log.error("subjectFindById ", e);
        throw  e
    }
}

async function findSubjectPaginated(query, option) {
    try {
        return await Subject.paginate(query,option)
    } catch (e) {
        log.error("findSubjectPaginated ", e);
        throw  e
    }
}

async function findSubjectById(id){
    try {
        return await Subject.findById(id)
    }catch (e) {
        log.error("findSubject", e);
        throw e
        
    }
}
async function deleteSubjectById(id){
    try {
        return await Subject.findByIdAndDelete(id)
    } catch (e) {
        log.error("deleteSubject", e);
        throw e
    }
}

async function updateSubjectById(id,updatedata,options){
    try {
         return await Subject.findByIdAndUpdate(id,updatedata,options);
    } catch (e) {
        log.error("updateSubjectById", e)
        throw e
        
    }
}

async function updateSubject(query,updatedata,options){
    try {
        return await Subject.findOneAndUpdate(query,updatedata,options);
    } catch (e) {
        log.error("updateSubject", e);
        throw e
    }
}

module.exports={
    subjectCreate,
    findSubject,
    subjectFindOne,
    findSubjectById,
    deleteSubjectById,
    updateSubjectById,
    findSubjectPaginated,
    updateSubject
};
