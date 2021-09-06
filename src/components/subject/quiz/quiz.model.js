const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const quizSchema = new Schema({
    name:Schema.Types.String,
    question: Schema.Types.String,
    correctAnswer: Schema.Types.String,
    options: [Schema.Types.String],
    marks: Schema.Types.Number,
    timeLimit: Schema.Types.Number,
    tagId:[{
        type:Schema.Types.ObjectId,
        ref: 'tag'
    }],
    topicId:{
        type: Schema.Types.ObjectId,
        ref: 'topic'
    },
    subjectId:{
        type: Schema.Types.ObjectId,
        ref: 'subject'
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
},{timestamps:true});

quizSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('quiz', quizSchema);
