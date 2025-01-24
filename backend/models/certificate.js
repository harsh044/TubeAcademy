const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificateId: {
        type: String
    },
    certificateUrl: {
        type: String
    }
},{ timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);