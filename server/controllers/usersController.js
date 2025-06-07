const User = require('../models/User');
const Member = require('../models/Member');
const Hub = require('../models/Hub');
const Token = require('../models/Token');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../config/sendEmail');

// TODO: add user linking and member creation

const debugTestEmail = async (req, res) => {
    sendVerificationEmail({ email: 'noahwhelden@gmail.com', url: 'http://localhost:3000/'})
};

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // select() to choose which elements to take, for example select('-password') will exclude the password
    // lean() to get data as JSON without extra method information
    const users = await User.find().select('-password').lean();

    if (!users?.length) {
        // if no members exist, return JSON with bad request message
        return res.status(400).json({ message: 'No users found.' });
    }

    // return found users
    res.json(users);
};

// @desc Get user by username
// @route GET /users/:username
// @access Private
const getMemberByUsername = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json({ message: 'Username required.' });
    }

    const user = await User.findOne({ 'username': username }).select('-password');

    if (!user) {
        // if no members exist, return JSON with bad request message
        return res.status(400).json({ message: `User ${username} not found.` });
    }

    if (user.member) {
        const member = await Member.findOne({ '_id': user.member });

        if (!member) {
            const memberObject = { email: user.email, username: user.username };
            const newMember = await Member.create(memberObject);
            user.member = newMember._id;
            await user.save();

            return res.json(newMember);
        }

        // return found member
        return res.json(member);
    }

    return res.status(401).json({ message: 'Unauthorized.' });
};

// @desc Create new user
// @route POST /users
// @access Public
const createNewUser = async (req, res) => {
    const { email, username, password, roles } = req.body;

    // Confirm that data is valid
    if (!email || !username || !password) {
        // if missing required information, return JSON with bad request message
        return res.status(400).json({ message: 'Email, username, and password fields are required.' });
    }

    // Check for duplicate user information
    // TODO: might need to modify this $or query
    const duplicateUsername = await User.findOne({ username }).lean().exec();
    const duplicateEmail = await User.findOne({ email }).lean().exec();

    if (duplicateUsername || duplicateEmail) {
        // if duplicate, return JSON with conflict message
        return res.status(409).json(
            {
                message: 'Duplicate email or username.',
                duplicateUsername: (duplicateUsername != null),
                duplicateEmail: (duplicateEmail != null)
            }
        );
    }

    const emailIdentifier = email.split('@').pop();
    const hub = await Hub.findOne({ emailIdentifier }).lean().exec();

    if (!hub) {
        return res.status(404).json({ message: `MESH Hub for ${emailIdentifier} does not exist.` });
    }

    // TODO: create member on user creation
    let userObject;
    const userRoles = new Map();
    userRoles.set(hub._id, ['Guest']);

    if (roles?.includes('Admin')) {
        // TODO: i don't think this works, needs to be roles: {}
        userObject = { email, username, password, roles };
    }
    else {
        userObject = { email, username, password, roles: userRoles };
    }

    // Create and store the new user
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${username} created.` });
    }
    else {
        return res.status(400).json({ message: 'Invalid user data received.' });
    }

    // Check for duplicate member information
    const memberObject = { email: email, name: username, username: username, hub: hub._id };
    const member = await Member.create(memberObject);

    if (!member) {
        return res.status(400).json({ message: 'Failed to create member object.' });
    }

    // Create new member and link to User
    user.member = member._id;
    await user.save();

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
    const url = `http://${process.env.CLIENT_URL}/users/${user._id}/verify/${token.token}`
    await sendVerificationEmail({ email: user.email, url})
};

// @desc Verify account email
// @route GET /users/:id/verify/:token
// @access Public
const getUserVerificationById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token
    });

    // TODO: if member exists with given email already, link user to member

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
    const { id, email, username, password, roles } = req.body;

    // All fields (except password and roles) are required
    if (!id || !email || !username) {
        return res.status(400).json({ message: 'All fields except password and roles are required' })
    }

    // Confirm that data is valid
    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }
    // Ensure requesting user is authorized to update
    user.email = email;
    user.username = username;

    if (password) {
        user.password = password;
    }

    // Only administrators should be able to update user roles
    if (req.roles.includes('Admin')) {
        if (roles) {
            user.roles = roles;
            console.log('roles updated', user.roles);
        }
    }

    const updatedUser = await user.save();

    return res.json({ message: `${updatedUser.username} updated.` });
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
    debugTestEmail,
    getAllUsers,
    createNewUser,
    getUserVerificationById,
    getMemberByUsername,
    updateUser,
    deleteUser
};