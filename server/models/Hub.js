const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    emailIdentifier: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    users: {
        type: Map,
        of: {
            roles: [String],
            visibility: String, // private, public
            joinedAt: Date,
            status: String  // active, inactive, pending, etc.
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Hub', hubSchema);