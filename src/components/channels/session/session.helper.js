const {log4js} = require('../../../services/logger')
const log = log4js.getLogger("webchat.helper")
const dbFlow = require('../../flow/flow.DAL')
const {quizFindById} = require("../../subject/quiz/quiz.Dal");

async function createFlowConversion(flowId, checkForProvisoConversion) {
    try {
        log.trace("Starting new flow....", flowId)
        let conversionData = {}
        const flow = await dbFlow.findFlow({_id: flowId}, 'steps');
        if (!flow) {
            log.error("FLow not found")
            throw "Flow not found"
        }
        const steps = flow.steps
        const flowStepMap = {};
        steps.forEach((step, index) => {
            if (step.nextRedirectType === 'next-step') {
                if (steps[index + 1] && steps[index + 1]._id) {
                    step.redirect = steps[index + 1]._id;
                } else {
                    step.redirect = null;
                    step.nextRedirectType = 'end';
                }
                flowStepMap[step._id] = step
            } else if (step.nextRedirectType === 'flow') {
                if (steps[index + 1] && steps[index + 1]._id) {
                    step.redirect = steps[index + 1]._id;
                } else {
                    step.redirect = null;
                    step.nextRedirectType = 'end';
                }
                flowStepMap[step._id] = step;
            } else if (step.nextRedirectType === 'step') {
                flowStepMap[step._id] = step;

            } else if (
                step.nextRedirectType === 'end' ||
                step.nextRedirectType === null ||
                step.nextRedirectType === ''
            ) {
                step.redirect = null;
                flowStepMap[step._id] = step;

            }
        })
        conversionData.flowStepMap = flowStepMap
        conversionData.stepToRun = steps[0]._id;
        conversionData.currentFlowId = flowId
        if (checkForProvisoConversion) {
            if (!conversionData.provisoConversion) {
                conversionData.provisoConversion = []
            }
            conversionData.provisoConversion.push({
                flowStepMap,
                stepToRun: conversionData.stepToRun,
                currentFlowId: conversionData.currentFlowId
            })
        }
        return conversionData
    } catch (e) {
        log.error("createFlowConversion", e);
        throw  e
    }
}


async function processForNextRedirect(conversionData) {
    try {
        const step = conversionData.flowStepMap[conversionData.stepToRun]
        // todo check for previous step if mcq or video
        if (step.type === 'mcq') {
            const choices = step.mcq.choices;
            for (let choiceIndex = 0; choiceIndex < step.mcq.choices.length; choiceIndex++) {
                console.log(choices[choiceIndex].text.toLowerCase(), conversionData.text.toLowerCase())
                if (choices[choiceIndex].text.toLowerCase() === conversionData.text.toLowerCase()) {
                    if (choices[choiceIndex].nextRedirectType !== 'next-step') {
                        step.redirect = choices[choiceIndex].redirect
                        step.nextRedirectType = choices[choiceIndex].nextRedirectType;
                        step.redirectFlow = choices[choiceIndex].redirectFlow;
                    }
                    break;
                }
            }
        }
        if (step.type === 'quiz') {
            const quizData = await quizFindById(step.quiz.quizId);
            if (conversionData.text.toLowerCase() === quizData.correctAnswer.toLowerCase()) {
                step.redirect = step.quiz.correct.redirect
                step.nextRedirectType = step.quiz.correct.nextRedirectType;
            } else {
                step.redirect = step.quiz.incorrect.redirect
                step.nextRedirectType = step.quiz.incorrect.nextRedirectType;
            }
        }
        log.trace("Next Redirect Type", step)
        switch (step.nextRedirectType) {
            case 'step':
                conversionData.stepToRun = step.redirect
                break;
            case 'next-step':
                conversionData.stepToRun = step.redirect
                break;
            case 'flow':
                if (!conversionData.provisoConversion) {
                    conversionData.provisoConversion = []
                }
                console.log("conversionData.stepToRun",conversionData.stepToRun)
                conversionData.provisoConversion.push({
                    flowStepMap: conversionData.flowStepMap,
                    stepToRun: conversionData.stepToRun,
                    currentFlowId: conversionData.currentFlowId
                })
                const newConversionData = await createFlowConversion(step.redirectFlow, true)
                conversionData.stepToRun = newConversionData.stepToRun;
                conversionData.currentFlowId = newConversionData.currentFlowId;
                conversionData.flowStepMap = newConversionData.flowStepMap;
                break;
            case 'end':
                console.log(conversionData.provisoConversion && conversionData.provisoConversion.length)
                if (conversionData.provisoConversion && conversionData.provisoConversion.length) {
                    const provisoConversion = conversionData.provisoConversion.pop()
                    log.trace("Pop conversion from provisoConversion",provisoConversion.stepToRun)
                    conversionData.flowStepMap = provisoConversion.flowStepMap;
                    conversionData.stepToRun = provisoConversion.stepToRun;
                    conversionData.currentFlowId = provisoConversion.currentFlowId;
                    const provisoStep = conversionData.flowStepMap[conversionData.stepToRun];
                    conversionData.stepToRun = provisoStep.redirect;
                    console.log("conversionData",conversionData)
                } else {
                    conversionData.stepToRun = null
                }
                break;
        }
        return conversionData
    } catch (e) {
        log.error("processForNextRedirect", e);
        throw e
    }
}


module.exports = {
    createFlowConversion,
    processForNextRedirect
}
