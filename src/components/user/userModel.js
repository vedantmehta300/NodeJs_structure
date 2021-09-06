/**
 * Model Definition File
 */

/**
 * System and 3rd Party libs
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Logger = require('../../services/logger')
const mongoosePaginate = require('mongoose-paginate')
const config = require('../../configuration/config.js')
/**
 * Schema Definition
 */

const userSchema = new Schema({
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    email: Schema.Types.String,
    password: Schema.Types.String,
    role: {
        type: Schema.Types.String,
        enum: ["teacher", "admin", "superAdmin"],
        default: "agent"
    },
});
userSchema.plugin(mongoosePaginate);

/**
 * Finds user from token
 * @param token
 */
userSchema.statics.findByToken = function (token) {
    let user = this;
    let decoded;
    let jwtSecret = process.env.jwtSecret;
    try {
        decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
        return Promise.reject({status: 'INVALID_TOKEN', message: 'Cannot decode token'});
    }

    return user.findOne({
        _id: decoded._id,
    });
};


/**
 * Generates Hash of the password before storing to database
 */
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
userSchema.pre('update', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

/**
 * Finds user from database and compares password
 * @param email
 * @param password
 */
userSchema.statics.findByCredentials = function (email, password) {
    let user = this;
    return user.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject({
                status: 'USER_NOT_FOUND',
                message: 'Incorrect email or password.',
            });
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res === true) {
                    return resolve(user);
                } else {
                    Logger.log.warn('Wrong Password for email:', user.email);
                    return reject({
                        status: 'USER_NOT_FOUND',
                        message: 'Incorrect email or password.',
                    });
                }
            });
        });
    });
};

/**
 * Generates token at the time of Login call
 */
userSchema.methods.getAuthToken = function () {
    let u = this;
    let jwtSecret = config.auth.jwtSecret;
    let access = 'auth';
    let token = jwt.sign({_id: u._id.toHexString(), access}, jwtSecret).toString();
    return token;
};


/**
 * Export Schema
 */
module.exports = mongoose.model('user', userSchema);
