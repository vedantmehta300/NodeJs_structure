const express = require('express');
const route = express();
const flowController = require('./flow-step.controller')

route.post('/', flowController.createStep)

route.get('/:flowId', flowController.flowStepList)

route.put('/:stepId', flowController.updateFlowStep)

route.delete('/:stepId', flowController.deleteFlowStep)

module.exports = route;
