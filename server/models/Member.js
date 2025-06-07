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
    username: {
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
    connections: {
        instagram: { type: String },
        linkedin: { type: String },
        personal: { type: String }
    }
});

module.exports = mongoose.model('Member', memberSchema);