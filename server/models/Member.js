// MEMBER DATA MODEL
const mongoose = require('mongoose');

const memberSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    internships: [{
        type: String,
        required: false
    }],
    research: [{
        type: String,
        required: false
    }],
    picture: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    /*visibility: {
        type: String,
        required: false,
        default: "visible"
    }*/
});

module.exports = mongoose.model('Member', memberSchema);