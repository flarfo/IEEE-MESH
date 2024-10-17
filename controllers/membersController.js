const Member = require('../models/Member');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// HTTP controller methods for Members data (Routing found in routes/memberRoutes)

// @desc Get all members
// @route GET /members
// @access Private
const getAllMembers = asyncHandler(async (req, res) => {
    // select() to choose which elements to take, for example select('-password') will exclude the password
    // lean() to get data as JSON without extra method information
    const members = await Member.find().select().lean();

    if (!members) {
        // if no members exist, return JSON with bad request message
        return res.status(400).json({ message: 'No members founds.' });
    }

    // return found users
    res.json(members);
});

// @desc Create new member
// @route POST /members
// @access Private
const createNewMember = asyncHandler(async (req, res) => {
    const { name, email, roles, internships, research } = req.body;

    // Confirm that data is valid
    if (!name || !email) {
        // if missing required information, return JSON with bad request message
        return res.status(400).json({ message: 'Name and email fields are required.'});
    }

    // Check for duplicate information
    const duplicate = await Member.findOne({ email }).lean().exec();

    if (duplicate) {
        // if duplicate, return JSON with conflict message
        return res.status(409).json({ message: 'Duplicate email.'});
    }

    const memberObject = { name, email, roles, internships, research };

    // Create and store the new member
    const member = await Member.create(memberObject);

    if (member) {
        res.status(201).json({ message: `New member ${name} created.` });
    }
    else {
        res.status(400).json({ message: 'Invalid member data received.' });
    }
});

// @desc Update a member
// @route PATCH /members
// @access Private
const updateMember = asyncHandler(async (req, res) => {

});

// @desc Delete a member
// @route DELETE /members
// @access Private
const deleteMember = asyncHandler(async (req, res) => {

});

module.exports = {
    getAllMembers,
    createNewMember,
    updateMember,
    deleteMember
};