const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    instructorName: {
        type: String
    },
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    totalDuration: {
        type: Number,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        }
    ],
    instructorLogo: {
        type: String
    },
    thumbnailImage: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    status: {
        type: String,
        enum: ['Draft', 'Published']
    }
},{timestamps: true});

module.exports = mongoose.model('Course', courseSchema);