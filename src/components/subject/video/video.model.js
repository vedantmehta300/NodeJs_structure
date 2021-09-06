const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const videoSchema = new Schema({
    name:{
        type:Schema.Types.String,
        required:true,
    },
    url: Schema.Types.String,
    tags:{
        type:Schema.Types.ObjectId,
        ref: 'tag'
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
    topicId:{
        type: Schema.Types.ObjectId,
        ref: 'topic'
    },
    subjectId: {
        type:Schema.Types.ObjectId,
        ref: 'subject'
    },

},{timestamps:true});

videoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('video', videoSchema);
