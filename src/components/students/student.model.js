/**
 * System and 3rd Party libs
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoosePaginate = require('mongoose-paginate');
const Logger = require('../../services/logger')
const config = require('../../configuration/config.js')
const Schema = mongoose.Schema;

const studentModel = new Schema({
    name:Schema.Types.String,
    email:Schema.Types.String,
    password:Schema.Types.String,
    phone:Schema.Types.String,
    socketIds:[Schema.Types.String],
    sessionId:{
        type:Schema.Types.ObjectId,
        ref:"session"
    }
})
studentModel.plugin(mongoosePaginate);

studentModel.pre('save', function (next) {
    var student = this;
    if (student.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(student.password, salt, (err, hash) => {
                student.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

/**
 * Finds student from token
 * @param token
 */
 studentModel.statics.findByToken = function (token) {
    let student = this;
    let decoded;
    let jwtSecret = process.env.jwtSecret;
    try {
        decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
        return Promise.reject({status: 'INVALID_TOKEN', message: 'Cannot decode token'});
    }

    return student.findOne({
        _id: decoded._id,
    });
};

/**
 * Finds user from database and compares password
 * @param email
 * @param password
 */
 studentModel.statics.findByCredentials = function (email, password) {
    let student = this;
    return student.findOne({email}).then((student) => {
        if (!student) {
            return Promise.reject({
                status: 'STUDENT_NOT_FOUND',
                message: 'Incorrect email or password.',
            });
        }
        return new Promise((resolve, reject) => {
                const match=bcrypt.compare(password, student.password)
                if (match) {
                    return resolve(student);
                } else {
                    Logger.log.warn('Wrong Password for email:', student.email);
                    return reject({
                        status: 'STUDENT_NOT_FOUND',
                        message: 'Incorrect email or password.',
                    });
                }
        
        });
    });
};

/**
 * Generates token at the time of Login call
 */
studentModel.methods.getAuthToken = function () {
    let s = this;
    let jwtSecret = config.auth.jwtSecret;
    let access = 'auth';
    let token = jwt.sign({_id: s._id.toHexString(), access}, jwtSecret).toString();
    return token;
};


module.exports = mongoose.model('student', studentModel);
