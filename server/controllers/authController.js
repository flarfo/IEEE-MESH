const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc Register new user
// @route POST /register
// @access Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    // TODO: check if username/email/password is valid

    // Check if user already exists
    const duplicateUser = await User.findOne({ username });
    if (diplicateUser) {
        return res.status(400).json({ message: 'Duplicate user.' });
    }

    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail){
        return res.status(400).json({message: 'Duplicate email.'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: `User ${username} registered successfully.` });
};

// @desc Login to existing user
// @route POST /login
// @access Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
};

module.exports = { registerUser, loginUser };

