// MEMBER DATA MODEL
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const memberSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
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