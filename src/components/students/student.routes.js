const express = require('express');
const route = express();
const StudentController = require('./student.controller');
const StudentAuthController = require('./student.auth.controller');
const auth=require('./student.auth');
const authentication = require('../../middlewares/authentication');


route.use('/auth',auth);

route.post('/', authentication.authenticateUser,StudentController.createStudent);

route.put("/:studentId", authentication.authenticateUser, StudentController.updateStudent);

route.get('/', authentication.authenticateUser, StudentController.getStudentWithPaginate);

route.delete("/:studentId",authentication.authenticateUser, StudentController.deleteStudent);

route.get('/all/:studentId', authentication.authenticateUser, StudentController.getStudentById);

route.get('/all', authentication.authenticateUser, StudentController.getStudents);

route.get('/transcript/:studentId',authentication.authenticateUser,  StudentController.getTranscript);

module.exports = route;
