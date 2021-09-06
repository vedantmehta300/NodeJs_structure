const Student = require('./student.model')
const {createSuccessfullyResponse} = require("../../helper/successResponse.helper");
const {generateUnhandledRequest} = require("../../helper/errorHandler.helper");
const {generateBadRequest} = require("../../helper/errorHandler.helper");
const {NULL_SHING_VALUE} = require("../../helper/common.helper");
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("student.auth.controller");
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const dbStudent=require('./student.DAL')
const jwt=require('jsonwebtoken');
const config=require('../../configuration/config')
const bcrypt = require('bcryptjs');

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
    api_key:"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"
    },
}))

/**
 * Student login
 */
async function login(req, res) {
    try {
        if (NULL_SHING_VALUE.includes(req.body.email) || NULL_SHING_VALUE.includes(req.body.password)) {
            throw  await generateBadRequest("the request missing some importance fields")
        }
        let studentId = req.body.email;
        let password = req.body.password;
        const student = await Student.findByCredentials(studentId, password)
        let token = await student.getAuthToken();
        const data = {
            name: student.name,
            phone:student.phone,
            email: student.email,
            _id: student._id,
            token: token,
        }
        const successResponse = await createSuccessfullyResponse("Student login successfully", data, "LOGIN_SUCCESS")
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error(" Student login unhandled", e)
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

async function forgotPassword(req,res){
    try {
        const {email}=req.body
        console.log(email)
        if (NULL_SHING_VALUE.includes(email)) {
            throw  await generateBadRequest("the request missing some importance fields")
        }
        const studentemail= await dbStudent.studentFindOne({email})
        if(!studentemail){
            throw await generateBadRequest('the email not found')
        }
        let jwtSecret = config.auth.jwtSecret;
        let id=studentemail._id
       const payload={
        id:id
       }
       const token =jwt.sign(payload,jwtSecret)
       
        const link =`http://localhost:4500/resetpassword/${id}/${token}`
        console.log(token)

         transporter.sendMail({
                to:email,
                from:"no-reply@samvadan.com",
                subject:"Reset password link",
                html:`
                <h5>here is your reset password link  ${link}</h5>
                `
            })
            const successResponse = await createSuccessfullyResponse("Reset password link send to your mail ", "RESET_PASSWORD_SUCCESS")
            res.status(successResponse.statusCode).json(successResponse)

        } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("Forgot password unhandled", e)
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

async function resetPassword(req,res){
    try {
        const {id,token}=req.query
        console.log(id)
        jwtSecret=config.auth.jwtSecret

        const decode=jwt.verify(token,jwtSecret)
        console.log(decode)
        if(id!=decode.id){
            throw await generateBadRequest("token is invalid")
        }
        const {password}=req.body
        const hash = await bcrypt.hash(password, 10);
       
        const update={
            password:hash
        }
        const student = await dbStudent.updateStudentById({_id: id},update);
        const successResponse = await createSuccessfullyResponse("Password update successfully", student, "PASSWORD_UPDATED");
        res.status(successResponse.statusCode).json(successResponse)
        
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("Reset password unhandled", e)
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

module.exports = {
    login,
    forgotPassword,
    resetPassword
   
};
