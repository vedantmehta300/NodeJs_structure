/**
 * System and 3rd Party libs
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const flowStepModel = new Schema({
    name: Schema.Types.String,
    flowId: {
        type: Schema.Types.ObjectId,
        ref: 'flow'
    },
    type: {
        type: Schema.Types.String,
        enum: ['text', 'mcq', 'quiz', 'video', 'delay','progress']
    },
    nextRedirectType: {
        type: Schema.Types.String,
        enum: ['step', 'flow', 'next-step', 'end']
    },
    redirect: Schema.Types.String,
    redirectFlow: {type: Schema.Types.ObjectId, ref: 'flow'},
    text: {
        text: [Schema.Types.String]
    },
    mcq: {
        text: Schema.Types.String,
        choices: [{
            text: Schema.Types.String,
            nextRedirectType: {
                type: Schema.Types.String,
                enum: ['step', 'flow', 'next-step', 'end']
            },
            redirect: Schema.Types.String,
            redirectFlow: {type: Schema.Types.ObjectId, ref: 'flow'},

        }]
    },
    video: {
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: 'subject'
        },
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'video'
        },
        topicId: {
            type: Schema.Types.ObjectId,
            ref: 'topic'
        }
    },
    quiz: {
        quizId: {
            type: Schema.Types.ObjectId,
            ref: 'quiz'
        },
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: 'subject'
        },
        topicId: {
            type: Schema.Types.ObjectId,
            ref: 'topic'
        },
        correct: {
            nextRedirectType: {
                type: Schema.Types.String,
                enum: ['step', 'flow', 'next-step', 'end'],
                default: "next-step"
            },
            redirect: {type: Schema.Types.ObjectId, ref: 'step'},
            redirectFlow: {type: Schema.Types.ObjectId, ref: 'flow'},
        },
        incorrect: {
            nextRedirectType: {
                type: Schema.Types.String,
                enum: ['step', 'flow', 'next-step', 'end'],
                default: "next-step"
            },
            redirect: {type: Schema.Types.ObjectId, ref: 'step'},
            redirectFlow: {type: Schema.Types.ObjectId, ref: 'flow'},
        },

    },
    progress: {
        percentage: {type: Schema.Types.Number,  default: 0}
    }
}, {timestamps: true})
module.exports = mongoose.model('flow-step', flowStepModel);
