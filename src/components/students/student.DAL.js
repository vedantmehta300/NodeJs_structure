const StudentModel = require('./student.model');
const {log4js} = require('../../services/logger')
const log = log4js.getLogger("Student.DAL")


async function studentCreate(data){
    try {
        return await StudentModel.create(data)
    } catch (e) {
        log.error("createStudent", e);
        throw e
    }
}

async function findStudent(){
    try {
       return await StudentModel.find()
        
    } catch (e) {
        log.error("findStudent", e);
        throw e
    }
}

async function studentFindOne(query) {
    try {
        return await StudentModel.findOne(query)
    } catch (e) {
        log.error("studentFind", e);
        throw  e
    }
}

async function findStudentPaginated(query, option) {
    try {
        return await StudentModel.paginate(query,option)
    } catch (e) {
        log.error("findStudentPaginated ", e);
        throw  e
    }
}

async function findStudentById(id){
    try {
        return await StudentModel.findById(id)
    }catch (e) {
        log.error("findStudent", e);
        throw e
        
    }
}
async function deleteStudentById(id){
    try {
        return await StudentModel.findByIdAndDelete(id)
    } catch (e) {
        log.error("deleteSubject", e);
        throw e
    }
}

async function updateStudentById(id,updatedata,options){
    try {
         return await StudentModel.findByIdAndUpdate(id,updatedata,options);
    } catch (e) {
        log.error("updateStudentById", e)
        throw e
        
    }
}


async function updateStudent(query,updatedata,options){
    try {
        return await StudentModel.findOneAndUpdate(query,updatedata,options);
    } catch (e) {
        log.error("updateStudent", e);
        throw e
    }
}

module.exports={
    studentCreate,
    findStudent,
    studentFindOne,
    findStudentById,
    deleteStudentById,
    updateStudentById,
    findStudentPaginated,
    updateStudent,

};
