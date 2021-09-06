const mongoose = require('mongoose');
const {NULL_SHING_VALUE} = require("../../helper/common.helper");
const {generateUnhandledRequest, generateBadRequest} = require("../../helper/errorHandler.helper");
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("Flow.controller");
const dbFLow = require('./flow.DAL');
const dbStep = require('./flow-step/flow-step.DAL');
const {isInvalidObjectId} = require("../../helper/common.helper");
const {createSuccessfullyResponse} = require("../../helper/successResponse.helper");

async function createFlow(req, res) {
    try {
        const {name} = req.body;
        if (NULL_SHING_VALUE.includes(name)) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        await dbFLow.create({name})
        const successResponse = await createSuccessfullyResponse("Flow created successfully", {}, "FLOW_CREATE");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("create FLow  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while create organization');
        return res.status(e.statusCode).json(exception)
    }
}

async function listWithPaginate(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1; // page number
        const limit = parseInt(req.query.limit, 10) || 10; // page size
        let searchParam = ""
        let query = {}
        if (!NULL_SHING_VALUE.includes(req.query.searchParam)) {
            query.name = new RegExp(req.query.searchParam, 'g')
        }
        const options = {
            page,
            limit,
            sort: {
                createdAt: 'desc'
            },
            select: {
                name: 1,
            }
        };
        const paginatedList = await dbFLow.flowPaginate(query, options);
        const successResponse = await createSuccessfullyResponse("Flow fetched successfully", paginatedList, "FLOW_FETCHED_PAGINATED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("listWithPaginate  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while fetch flow data ');
        return res.status(e.statusCode).json(exception)
    }
}

async function updateFlow(req, res) {
    try {
        const {flowId} = req.params;
        const {name, steps} = req.body
        if (isInvalidObjectId(flowId) || NULL_SHING_VALUE.includes(name) || NULL_SHING_VALUE.includes(steps)) {
            throw await generateBadRequest("the request missing some importance fields for update flow")
        }
        await dbFLow.findOneAndUpdate({_id: flowId}, {$set: {name, steps}}, {new: true});
        const successResponse = await createSuccessfullyResponse("Flow updated successfully", {}, "FLOW_UPDATE");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("updateFlow  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while update flow');
        return res.status(e.statusCode).json(exception)
    }
}

async function deleteFlow(req, res) {
    try {
        const {flowId} = req.params;
        if (isInvalidObjectId(flowId)) {
            throw await generateBadRequest("the request missing some importance fields for update flow")
        }
        await dbFLow.findOneAndDelete({_id: flowId})
        const successResponse = await createSuccessfullyResponse("Flow deleted successfully", {}, "FLOW_DELETED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("deleteFlow  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while delete flow');
        return res.status(e.statusCode).json(exception)
    }
}

async function flowList(req, res) {
    try {
        const flow = await dbFLow.find({}, {name: 1, _id: 1})
        const successResponse = await createSuccessfullyResponse("Flow fetch successfully", flow, "FLOW_FETCH");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("deleteFlow  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while delete flow');
        return res.status(e.statusCode).json(exception)
    }
}

async function getFlowById(req, res) {
    try {
        const {flowId} = req.params;
        if (isInvalidObjectId(flowId)) {
            throw await generateBadRequest("the request missing some importance fields for update flow")
        }
        const flow = await dbFLow.findFlow({_id: flowId}, 'steps')
        const successResponse = await createSuccessfullyResponse("Flow fetch successfully", flow, "FLOW_FETCH");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("deleteFlow  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while delete flow');
        return res.status(e.statusCode).json(exception)
    }
}

async function copyFlow(req, res) {
    try {
        const { flowId } = req.params;

        if (isInvalidObjectId(flowId)) {
            throw await generateBadRequest("the request missing some importance fields for copy flow")
        }

        const [flow, flowSteps] = await Promise.all([dbFLow.findFlow({_id: flowId}), dbStep.find({flowId}, {})]);
        const stepIdMap = {};
        const newSteps = [];
        const newFlowStepId = [];
        const flowName  = `copy_${flow.name}`;
        const newFlow = await dbFLow.create({ name: flowName});

        if(flowSteps && flowSteps.length) {
            flowSteps.forEach(step =>{
                stepIdMap[step._id] = new mongoose.Types.ObjectId();
                newFlowStepId.push(stepIdMap[step._id]);
            });

            for(let stepIndex = 0; stepIndex <flowSteps.length; stepIndex++) {
                const step  = flowSteps[stepIndex];
                step._id = stepIdMap[step._id];
                step.flowId = newFlow._id;
                if( step.redirect) {
                    step.redirect = stepIdMap[step.redirect];
                }
                if(step.type === 'mcq' && step.mcq.choices && step.mcq.choices.length){
                    for (let choiceIndex = 0; choiceIndex < step.mcq.choices.length; choiceIndex++){
                        if(step.mcq.choices[choiceIndex].redirect &&  stepIdMap[step.mcq.choices[choiceIndex].redirect]){
                            step.mcq.choices[choiceIndex].redirect = stepIdMap[step.mcq.choices[choiceIndex].redirect]
                        }
                    }
                }
                if(step.type === 'quiz'){
                    if(step.quiz.correct && step.quiz.correct.nextRedirectType === 'step'){
                        step.quiz.correct.redirect = stepIdMap[step.quiz.correct.redirect]
                    }
                    if(step.quiz.correct && step.quiz.correct.nextRedirectType === 'flow'){
                        step.quiz.correct.redirectFlow = stepIdMap[step.quiz.correct.redirectFlow]

                    }
                    if(step.quiz.incorrect && step.quiz.incorrect.nextRedirectType === 'step'){
                        step.quiz.incorrect.redirect = stepIdMap[step.quiz.correct.redirect]
                    }
                    if(step.quiz.incorrect && step.quiz.incorrect.nextRedirectType === 'flow'){
                        step.quiz.incorrect.redirectFlow = stepIdMap[step.quiz.incorrect.redirectFlow]

                    }
                }
                const date = new Date();
                step.createdAt = date;
                step.updatedAt = date;
                newSteps.push(step);
            }
        }
        await Promise.all([dbStep.create(newSteps), dbFLow.findOneAndUpdate({_id: newFlow._id}, {$set: { steps: newFlowStepId}}, {new: true})]) ;
        const successResponse = await createSuccessfullyResponse("Flow copy successfully", {_id:newFlow._id}, "FLOW_COPY");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("copyFlow :  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while copy flow');
        return res.status(e.statusCode).json(exception)
    }
}

module.exports = {
    createFlow,
    listWithPaginate,
    updateFlow,
    deleteFlow,
    flowList,
    getFlowById,
    copyFlow
};
