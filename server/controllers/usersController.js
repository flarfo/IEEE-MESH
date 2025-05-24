const User = require('../models/User');
const Member = require('../models/Member');
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

    if (user.username === req.username || req.roles.includes('Admin')) {
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
    const duplicateUser = await User.findOne({ $or: [{ username }, { email }] }).lean().exec();

    if (duplicateUser) {
        // if duplicate, return JSON with conflict message
        return res.status(409).json({ message: 'Duplicate email or username.' });
    }

    // TODO: create member on user creation
    let userObject;
    if (req.roles?.includes('Admin')) {
        // TODO: i don't think this works
        userObject = { email, username, password, roles };
    }
    else {
        userObject = { email, username, password, roles: ['Guest'] };
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
    const memberObject = { email: email, name: username, username: username };
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
    const url = `${process.env.CLIENT_URL}/users/${user._id}/verify/${token.token}`
    await sendEmail({
        email: user.email,
        subject: 'Verify Your Email',
        text: `Click the link to verify your email address.`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Verify Email</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 0;">
                    <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 6px; box-shadow: 0 0 6px rgba(0,0,0,0.1); font-family: Arial, sans-serif; padding: 40px;">
                        <tr>
                            <td align="center" style="padding-bottom: 20px; font-weight:900; font-size:32px">
                                IEEE MESH
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="font-size: 16px; color: gray;">
                            Please confirm that you want to use this as your account email address. Once verified, you can setup your profile and start connecting!
                            </td>
                        </tr>
                       <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                                <tr>
                                    <td align="center">
                                    <a href="${url}"
                                        style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 0; width: 100%; font-size: 16px; font-weight: bold; text-align: center; text-decoration: none; border-radius: 6px; font-family: Arial, sans-serif;">
                                        Verify my email
                                    </a>
                                    </td>
                                </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="font-size: 14px; color: #888;">
                            Or paste this link into your browser:<br>
                            <b>
                                <a href="{url}"
                                    style="color: #66B3F9; word-break: break-all; text-decoration:none">
                                    ${url}
                                </a>
                            </b>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 12px; color: gray; padding-top: 20px; font-family: Arial, sans-serif">
                            &copy; 2025 IEEE MESH. All rights reserved.<br>
                           Gainesville, FL 32612
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding-top: 10px;">
                            <img src="https://iconduck.com/api/v2/vectors/vctr640ufs5o/media/png/256/download" alt="Footer Icon" width="48">
                            </td>
                        </tr>
                </table>
            </body>
            </html>
        `
    });
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
    if (user.username === req.username || req.roles.includes('Admin')) {
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
    }

    return res.status(401).json({ message: 'Unauthorized.' });
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
    getMemberByUsername,
    updateUser,
    deleteUser
};