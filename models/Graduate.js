// GRADUATE DATA MODEL
const mongoose = require('mongoose');

const recruiterSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Graduate', recruiterSchema);