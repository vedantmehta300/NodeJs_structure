const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const subjectSchema = new Schema({
    name:{
        type:Schema.Types.String,
        required:true,
    },
    topic:[{
        type: Schema.Types.ObjectId,
        ref: 'topic'
    }],
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
    icon: Schema.Types.String,
},{timestamps:true});

subjectSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('subject', subjectSchema);
