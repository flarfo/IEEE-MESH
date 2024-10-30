// MEMBER DATA MODEL
const mongoose = require('mongoose');

const memberSchema  = new mongoose.Schema({
    roles: [{
        type: String,
        default: "Member"
    }],
    internships: [{
        type: String,
        required: false
    }],
    research: [{
        type: String,
        required: false
    }]
});

module.exports = mongoose.model('Member', memberSchema);