const {log4js} = require('../../../services/logger')
const log = log4js.getLogger("Webchat controller")
const dbSession = require('../session/session.DAL')
const {videoFindById} = require("../../subject/video/video.Dal");
const {quizFindById} = require("../../subject/quiz/quiz.Dal");
const {emitEventToTargetId} = require("../../../helper/socket.helper");
const {WEBCHAT_SOCKET_EVENT} = require("./webchat.helper");
const {createFlowConversion, processForNextRedirect} = require("../session/session.helper");
let gatWayController
const dbTranscript = require('../../transcript/transcript.DAL')
setTimeout(() => {
    gatWayController = require('../../CommonGateway/CommonGateway.controller')

}, 1000)

async function handleRequest(channelData) {
    try {
        const {from} = channelData
        const transcript = {
            studentId: from.id,
            isFromBot: false,
            type: "text",
            text: {
                text: [channelData.text]
            }
        }
        dbTranscript.create(transcript)
        const session = await dbSession.get({studentId: from.id});
        let conversionData = session.conversion;
        if (!conversionData || !Object.keys(conversionData).length || channelData.text.includes('00TOPIC00')) {
            let flowId = ""
            if (channelData.text.includes('00TOPIC00')) {
                flowId = channelData.text.split('/')[2]
            }
            conversionData = await createFlowConversion(flowId, false)
        } else if (conversionData.stepToRun) {
            conversionData.text = channelData.text
            conversionData = await processForNextRedirect(conversionData)
        }
        await dbSession.set({query: {studentId: from.id}, conversion: JSON.stringify(conversionData)})
        if (conversionData.stepToRun) {
            console.log("conversionData.stepToRun", conversionData.stepToRun)
            await processStep(from.id)
        }
    } catch (e) {
        log.error("handleRequest", e)
    }
}

async function processStep(studentId) {
    try {
        const session = await dbSession.get({studentId});
        let conversionData = session.conversion;
        const step = session.conversion.flowStepMap[conversionData.stepToRun];
        const messageToSend = {
            channelId: "webchat",
            conversion: {
                id: session._id
            },
            from: {
                id: session.studentId,
                name: "NO name"
            },
            type: step.type,
            text: "",
            inputHint: "ignoreInput", // there is enum values for this we we need user input then values is expectingInput,otherwise ignoreInput
        }
        switch (step.type) {
            case 'text':
                messageToSend.text = step.text.text
                await sendToWebchat(session.socketIds, messageToSend)
                await handleRequest({
                    from: {
                        id: studentId
                    },
                    text: ""
                })
                break;
            case 'progress':
                messageToSend.progress = step.progress
                await sendToWebchat(session.socketIds, messageToSend)
                await handleRequest({
                    from: {
                        id: studentId
                    },
                    text: ""
                })
                break;
            case 'mcq':
                messageToSend.text = step.mcq.text
                messageToSend.choices = step.mcq.choices
                await sendToWebchat(session.socketIds, messageToSend)
                break;
            case 'video':
                messageToSend.text = step.text
                const video = await videoFindById(step.video.videoId);
                messageToSend.video = video
                await sendToWebchat(session.socketIds, messageToSend)
                break;
            case 'quiz':
                messageToSend.text = step.text
                const quizData = await quizFindById(step.quiz.quizId);
                messageToSend.type = 'mcq'
                messageToSend.choices = []
                quizData.options.forEach((option => {
                    messageToSend.choices.push({
                        text: option,
                        value: option
                    })
                }))
                messageToSend.text = quizData.question
                await sendToWebchat(session.socketIds, messageToSend)
                break;
            default:
                console.log("END FLOW")
        }
    } catch (e) {

    }
}

async function sendToWebchat(socketIds, activity) {
    try {
        activity.isFromBot = true
        dbTranscript.create(activity)
        log.trace("Sending message to user", activity.type)
        await emitEventToTargetId(socketIds, WEBCHAT_SOCKET_EVENT.BOT_MESSAGE, activity)
    } catch (e) {
        log.error("sendToWebchat", e)
    }
}

module.exports = {
    sendToWebchat,
    handleRequest
}
