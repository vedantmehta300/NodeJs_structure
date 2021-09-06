const {NULL_SHING_VALUE} = require("../../../helper/common.helper");
const {generateUnhandledRequest, generateBadRequest} = require("../../../helper/errorHandler.helper");
const {log4js} = require('../../../services/logger');
const log = log4js.getLogger("Flow-step.controller");
const dbStep = require('./flow-step.DAL')
const {isInvalidObjectId} = require("../../../helper/common.helper");
const {createSuccessfullyResponse} = require("../../../helper/successResponse.helper");

async function createStep(req, res) {
    try {
        const {name, flowId} = req.body
        if (isInvalidObjectId(flowId) || NULL_SHING_VALUE.includes(name)) {
            throw await generateBadRequest("the request missing some importance fields for update flow")
        }
        const step = await dbStep.create(req.body)
        const successResponse = await createSuccessfullyResponse("Flow step created successfully", step, "FLOW_CREATE");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("create step  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while create flow step');
        return res.status(e.statusCode).json(exception)
    }
}

async function updateFlowStep(req, res) {
    try {
        const {stepId} = req.params;
        const {name, flowId} = req.body
        if (isInvalidObjectId(stepId, flowId) || NULL_SHING_VALUE.includes(name)) {
            throw await generateBadRequest("the request missing some importance fields for update flow")
        }
        await dbStep.findOneAndUpdate({_id: stepId}, {$set: req.body}, {new: true})
        const successResponse = await createSuccessfullyResponse("Flow Step updated successfully", {}, "FLOW__STEP_UPDATE");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("updateFlowStep  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while update flow');
        return res.status(e.statusCode).json(exception)
    }
}

async function deleteFlowStep(req, res) {
    try {
        const {stepId} = req.params;
        if (isInvalidObjectId(stepId)) {
            throw await generateBadRequest("the request missing some importance fields for update flow")
        }
        await dbStep.findOneAndDelete({_id: stepId})
        const successResponse = await createSuccessfullyResponse("Flow step deleted successfully", {}, "FLOW_STEP_DELETED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("deleteFlowStep  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while delete flow');
        return res.status(e.statusCode).json(exception)
    }
}

async function flowStepList(req, res) {
    try {
        const {flowId} = req.params;
        if (isInvalidObjectId(flowId)) {
            throw await generateBadRequest("the request missing some importance fields for update flow")
        }
        const flow = await dbStep.find({flowId}, {})
        const successResponse = await createSuccessfullyResponse("Flow Step fetch successfully", flow, "FLOW_STEP_FETCH");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("flowStepList  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while delete flow');
        return res.status(e.statusCode).json(exception)
    }
}

module.exports = {
    createStep,
    updateFlowStep,
    deleteFlowStep,
    flowStepList,
}
