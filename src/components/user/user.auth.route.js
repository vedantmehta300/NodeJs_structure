const express = require('express');

const route = express();

const UserController = require('./UserController');

route.post('/', UserController.signUP);

route.post('/login', UserController.login);

module.exports = route;
