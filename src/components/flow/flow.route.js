const express = require('express');
const route = express();
const flowController = require('./flow.controller');

route.post('/', flowController.createFlow);

route.get('/', flowController.listWithPaginate);

route.get('/all', flowController.flowList);

route.put('/:flowId', flowController.updateFlow);

route.delete('/:flowId', flowController.deleteFlow);

route.get('/:flowId', flowController.getFlowById);

route.post('/copy/:flowId', flowController.copyFlow);


module.exports = route;
