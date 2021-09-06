const express = require('express');

const route = express();

const StudentAuthController = require('./student.auth.controller');

route.post('/forgotpassword', StudentAuthController.forgotPassword);

route.post('/resetpassword', StudentAuthController.resetPassword);

route.post('/login', StudentAuthController.login);



module.exports = route;