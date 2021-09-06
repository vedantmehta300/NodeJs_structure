const express = require('express')
const CommonGatewaycontroller = require('./CommonGateway.controller')
const route = express();

route.post('/:channelId',
    CommonGatewaycontroller.getRequestFromChannel
)

module.exports = route
