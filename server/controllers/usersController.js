const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const sendEmail = require('../config/sendEmail');

// TODO: add user linking and member creation

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // select() to choose which elements to take, for example select('-password') will exclude the password
    // lean() to get data as JSON without extra method information
    const users = await User.find().lean();
    
    if (!users?.length) {
        // if no members exist, return JSON with bad request message
        return res.status(400).json({ message: 'No users found.' });
    }

    // return found users
    res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Public
const createNewUser = async (req, res) => {
    const { email, password } = req.body;

    // Confirm that data is valid
    if (!email || !password) {
        // if missing required information, return JSON with bad request message
        return res.status(400).json({ message: 'Email and password fields are required.' });
    }

    // Check for duplicate information
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate) {
        // if duplicate, return JSON with conflict message
        return res.status(409).json({ message: 'Duplicate email.' });
    }

    const userObject = { email, password };

    // Create and store the new user
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${email} created.` });
    }
    else {
        return res.status(400).json({ message: 'Invalid user data received.' });
    }

    const tokenObject = {
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex')
    };

    // Create and store a new token 
    const token = await Token.create(tokenObject);
    if (token) {
        res.status(201);
    }
    else {
        return res.status(400);   
    }
    console.log('Sending email...');
    const url = `${process.env.CLIENT_URL}/users/${user._id}/verify/${token.token}`
    await sendEmail({
        email: user.email,
        subject: 'Verify Email',
        text: url
    });
};

const getUserVerificationById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token
    });

    if (!token) {
        return res.status(400).json({ message: 'Verification token not found.' });
    }

    await user.updateOne({
        verified: true
    });

    await token.deleteOne();
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const {id, email, password, roles} = req.body;

    // Confirm that data is valid
    const user = User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const duplicate = await User.findOne({ email }).lean().exec();

    // Verify that received id equals original id (the existing user we are searching for, not an actual duplicate) 
    if (duplicate && duplicate?._id.toString() !== id) {
        // if duplicate, return JSON with conflict message
        return res.status(409).json({ message: 'Duplicate email.' });
    }

    user.email = email;
    user.password = password
    user.roles = roles;
    
    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.email} updated.` });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID required.' })
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const result = await user.deleteOne();

    const reply = `User ${result.email} with ID ${result._id} deleted.`
    res.json(reply);
};

module.exports = {
    getAllUsers,
    createNewUser,
    getUserVerificationById,
    updateUser,
    deleteUser
};