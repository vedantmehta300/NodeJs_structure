const dbStudent = require('./student.DAL');
const dbTranscript = require('../transcript/transcript.DAL');
const {generateUnhandledRequest, generateBadRequest} = require('../../helper/errorHandler.helper');
const {createSuccessfullyResponse} = require('../../helper/successResponse.helper');
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("Student.controller");
const {NULL_SHING_VALUE, isInvalidObjectId} = require("../../helper/common.helper");

/**
 * Creates student
 */
async function createStudent(req, res) {
    try {
        const {name, email, password, phone} = req.body;

        if (NULL_SHING_VALUE.includes(name) || NULL_SHING_VALUE.includes(email) || NULL_SHING_VALUE.includes(password) || NULL_SHING_VALUE.includes(phone)) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        const student = await dbStudent.studentCreate({name, email, password, phone});
        const successResponse = await createSuccessfullyResponse("Student created successfully", student, "STUDENT_CREATE");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("createStudent:   unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while  create student');
        return res.status(e.statusCode).json(exception)
    }
}

/**
 * Update student
 */
async function updateStudent(req, res) {
    try {
        const {studentId} = req.params;
        const {name, email, phone} = req.body;

        if (isInvalidObjectId(studentId)) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        if (NULL_SHING_VALUE.includes(name) || NULL_SHING_VALUE.includes(email) || NULL_SHING_VALUE.includes(phone) ) {
            throw   generateBadRequest("the request missing some importance fields")
        }
        const studentData={
            name,
            email,
            phone
        }
        const student = await dbStudent.updateStudentById({_id: studentId},studentData );
        const successResponse = await createSuccessfullyResponse("Student update successfully", student, "STUDENT_UPDATED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("updateStudent  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while update student');
        return res.status(e.statusCode).json(exception)
    }
}

/**
 * Get student with paginate
 */
async function getStudentWithPaginate(req, res) {
    try {
        const {page, limit, searchParam} = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: {
                createdAt: 'desc',
            },
        };
        let query = {};

        if (!NULL_SHING_VALUE.includes(searchParam)) {
            query.name = {$regex: searchParam, $options: 'i'};
        }
        const students = await dbStudent.findStudentPaginated(query, options);
        const successResponse = await createSuccessfullyResponse("Student fetched successfully", students, "STUDENT_FETCHED_PAGINATED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("getStudentWithPaginate  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while fetch student');
        return res.status(e.statusCode).json(exception)
    }

}


/**
 * Get student by id
 */

async function getStudentById(req, res) {
    try {
        const {studentId} = req.params;
        if (isInvalidObjectId(studentId)) {
            throw await generateBadRequest("the request missing some importance fields for get subject")
        }
        const student = await dbStudent.findStudentById({_id: studentId})
        if (!student) {
            throw await generateBadRequest('student not found')
        }
        const successResponse = await createSuccessfullyResponse("student fetch successfully", student, "STUDENT_FETCH ");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getStudentById  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while get student ');
        return res.status(e.statusCode).json(exception)
    }

}

/**
 * Delete student
 */
async function deleteStudent(req, res) {
    try {
        const {studentId} = req.params;
        if (isInvalidObjectId(studentId)) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        const student = await dbStudent.deleteStudentById({_id: studentId});

        const successResponse = await createSuccessfullyResponse("Student deleted successfully", student, "STUDENT_DELETED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("deleteStudent  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while delete student');
        return res.status(e.statusCode).json(exception)
    }
}

/**
 * Get students
 */
async function getStudents(req, res) {
    try {
        const students = await dbStudent.findStudent()
        if (!students) {
            throw await generateBadRequest("Subjects not found ")
        }
        const successResponse = await createSuccessfullyResponse("Student fetched successfully", students, "STUDENT_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getStudent  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while get student ');
        return res.status(e.statusCode).json(exception)
    }
}

async function getTranscript(req, res) {
    try {
        const { studentId } = req.params;
        if(isInvalidObjectId(studentId) ){
            throw await generateBadRequest("the request missing some importance fields to fetch student data");
        }
        const transcriptData = await dbTranscript.get({ studentId });
        const successResponse = await createSuccessfullyResponse("student data fetched successfully",transcriptData , "STUDENT_TRANSCRIPT_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getTranscript  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while fetch student data ');
        return res.status(e.statusCode).json(exception)
    }
}


module.exports = {
    getStudents,
    getStudentWithPaginate,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent,
    getTranscript
}
