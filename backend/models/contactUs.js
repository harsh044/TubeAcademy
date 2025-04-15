const mongoose = require('mongoose')

const contactusSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    countrycode: {
        type: String,
    },
    mobilenumber: {
        type: Number,
    },
    message: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{timestamps: true});

module.exports = mongoose.model('ContactUs', contactusSchema);