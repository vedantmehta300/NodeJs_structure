/**
 * Model Definition File
 */

/**
 * System and 3rd Party libs
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

/**
 * Schema Definition
 */

const topicSchema = new Schema({
    name:Schema.Types.String,
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
    subjectId: {
        type:Schema.Types.ObjectId,
        ref: 'subject'
    },
    flowId:{
        type:Schema.Types.ObjectId,
        ref: 'flow'
    }
}, {timestamps:true});

topicSchema.plugin(mongoosePaginate);
/**
 * Export Schema
 */
module.exports = mongoose.model('topic', topicSchema);
