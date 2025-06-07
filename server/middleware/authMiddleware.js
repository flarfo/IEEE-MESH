// middleware/authMiddleware.js
const User = require('../models/User');

// Check if user is an admin
const isAdmin = (req) => {
    console.log(req.site_role);
    return req.site_role && req.site_role == 'Admin';
};

// Check if user is the content owner by comparing username
const isOwner = (req, resourceOwnerUsername) => {
    return req.username && req.username === resourceOwnerUsername;
};

const verifyAdmin = (req, res, next) => {
    try {
        if (isAdmin(req)) {
            return next();
        }

        return res.status(403).json({ message: 'Unauthorized. Admin role required.' });
    } 
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Middleware to verify ownership
const verifyOwner = async (req, res, next) => {
    try {
        const { id } = req.body;

        // Find the user in question
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if requester is the content owner
        if (isOwner(req, targetUser.username)) {
            return next();
        }

        return res.status(403).json({ message: 'Unauthorized. Only content owner can access.' });
    } 
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Middleware for verifying if user is admin or content owner
const verifyAdminOrOwner = async (req, res, next) => {
    try {
        // If user is admin, proceed
        if (isAdmin(req)) {
            return next();
        }

        // Get the user ID from request
        const { id } = req.body;

        // Find the user in question
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if requester is the content owner
        if (isOwner(req, targetUser.username)) {
            return next();
        }

        // If neither admin nor owner
        return res.status(403).json({ message: 'Unauthorized.' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    verifyAdminOrOwner,
    verifyAdmin,
    verifyOwner
};