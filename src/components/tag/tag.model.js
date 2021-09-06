const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const tagSchema = new Schema({
    name: Schema.Types.String,
    weight: Schema.Types.Number,
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
},{timestamps:true});

tagSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('tag', tagSchema);
