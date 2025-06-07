const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Username/email and password are required' });
    }

    const isEmail = identifier.includes('@');

    let foundUser;
    if (isEmail) {
        foundUser = await User.findOne({ email: identifier });
    }
    else {
        foundUser = await User.findOne({ username: identifier });
    }
    
    if (!foundUser) {

        return res.status(400).json({ message: 'User not found.' });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return res.status(400).json({ message: 'Incorrect username or password.' });

    const accessToken = jwt.sign(
        {
            'UserInfo': {
                'username': foundUser.username,
                'uid': foundUser._id,
                'roles': foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // DEV: 10s DEPLOY: 15m
    );

    const refreshToken = jwt.sign(
        { 'username': foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // DEV 20s DEPLOY: 7d
    );

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only by web server 
        secure: true, // https
        sameSite: 'None', // cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry: set to match refreshToken
    });

    // Send accessToken containing username and roles 
    res.json({ accessToken });
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const foundUser = await User.findOne({ username: decoded.username }).exec();

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = jwt.sign({
                'UserInfo': {
                    'username': foundUser.username,
                    'uid': foundUser._id,
                    'roles': foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken });
    });
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // No content
    console.log('Cookie cleared');
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
};