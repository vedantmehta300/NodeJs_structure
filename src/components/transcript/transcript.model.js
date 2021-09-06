/**
 * Model Definition File
 */

/**
 * System and 3rd Party libs
 */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;
const transcriptSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "student"
    },
    isFromBot: Schema.Types.Boolean,
    message: Schema.Types.Mixed,
    channel: Schema.Types.String,
    userId: Schema.Types.String
}, {strict: false, timestamps: true});

transcriptSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('transcript', transcriptSchema);
