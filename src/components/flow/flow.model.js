/**
 * System and 3rd Party libs
 */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const flowModel = new Schema({
    name: Schema.Types.String,
    steps: [{
        type: Schema.Types.ObjectId,
        ref: 'flow-step'
    }]
}, {timestamps: true})
flowModel.plugin(mongoosePaginate);
module.exports = mongoose.model('flow', flowModel);
