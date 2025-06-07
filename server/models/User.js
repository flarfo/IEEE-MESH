const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// TODO: update user and member routes
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    site_role: {
        type: String,
        required: true,
        default: 'Guest'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordValid = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);