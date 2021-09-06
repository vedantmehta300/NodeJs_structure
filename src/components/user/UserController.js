const User = require('./userModel')
const {createSuccessfullyResponse} = require("../../helper/successResponse.helper");
const {generateUnhandledRequest} = require("../../helper/errorHandler.helper");
const {generateBadRequest} = require("../../helper/errorHandler.helper");
const {NULL_SHING_VALUE} = require("../../helper/common.helper");
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("auth.route");

/**
 * Creates User - Sign-up Call
 */
async function signUP(req, res) {
    try {
        if (NULL_SHING_VALUE.includes(req.body.email) || NULL_SHING_VALUE.includes(req.body.password)) {
            throw  await generateBadRequest("the request missing some importance fields")
        }
        await User.create(req.body);
        const successResponse = await createSuccessfullyResponse("User created successfully", {}, "USER_CREATE")
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("Sign-up unhandled", e)
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest();
        return res.status(e.statusCode).json(exception)
    }
}

/**
 * Call for Login
 */
async function login(req, res) {
    try {
        if (NULL_SHING_VALUE.includes(req.body.email) || NULL_SHING_VALUE.includes(req.body.password)) {
            throw  await generateBadRequest("the request missing some importance fields")
        }
        let userId = req.body.email;
        let password = req.body.password;
        const user = await User.findByCredentials(userId, password)
        let token = await user.getAuthToken();
        const data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id,
            token: token,
            botId:user.botId
        }
        const successResponse = await createSuccessfullyResponse("User login successfully", data, "LOGIN_SUCCESS")
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("login unhandled", e)
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}



module.exports = {
    login,
    signUP
};
