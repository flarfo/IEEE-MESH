// MEMBER DATA MODEL
const mongoose = require('mongoose');

const memberSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: false
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
    approved: {
        type: Boolean,
        default: false
    }
    /*visibility: {
        type: String,
        required: false,
        default: "visible"
    }*/
});

module.exports = mongoose.model('Member', memberSchema);