const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sessionModel = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'student'
    },
    conversion: Schema.Types.Mixed,
    socketIds:[Schema.Types.String]
})

module.exports = mongoose.model('session', sessionModel);
