const userModel = require('../components/user/userModel');
const dbSession = require('../components/channels/session/session.model')
const {WEBCHAT_SOCKET_EVENT} = require("../components/channels/webchat/webchat.helper");
let webChatController
setTimeout(() => {
    webChatController = require("../components/channels/webchat/webchat.controller");
}, 1000)
const {log4js} = require('../services/logger')
const log = log4js.getLogger("Socket.helper")
let socketObject = null
let IoObject;
const HANDOFF_EVENTS = {
    USER_TRANSCRIPT_UPDATE: "userTranscriptUpdate",
    AGENT_MESSAGE: "agentMessage"
}

function createSocketConnection(io) {
    IoObject = io
    io.on("connection", async function (socket) {
        socketObject = socket
        /*   socket.on("join", async function (socketPayload) {
               log.trace("Socket Join....", socketPayload)

           })*/
        if (socket.handshake && socket.handshake.query) {
            const {userId, isWebchat} = socket.handshake.query
            if (userId) {
                await userModel.findOneAndUpdate({_id: userId}, {$addToSet: {socketConnections: socket.id}})
            }
            if (isWebchat === "true") {
                const {studentId} = socket.handshake.query;
                const updateData = {
                    $addToSet: {
                        socketIds: socket.id
                    }
                }
                console.log("Student connected",studentId)
                await dbSession.findOneAndUpdate({studentId},updateData,{upsert:true})
            }
        }
        socket.on('error', async err => {
            log.error("Error in connect Socket", err);
        });
        socket.on(WEBCHAT_SOCKET_EVENT.USER_MESSAGE, async (socketData) => {
            await webChatController.handleRequest(socketData, socket.id)
        })
    })
}

async function sendMessageToWebchat(id) {
    IoObject.to(id).emit("bot_messate", {message: "hello"})
}

async function emitEventToTargetId(socketIds, event, socketData) {
    log.trace(`emitEventToTargetId ${event}, ${socketData}`)
    if (!Array.isArray(socketIds)) {
        log.warn("Invalid socketIds")
        return;
    }
    socketIds.forEach(id => {
        IoObject.to(id).emit(event, socketData)
    })
}

module.exports = {
    emitEventToTargetId,
    createSocketConnection
}
