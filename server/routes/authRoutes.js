const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /login route for user login
router.route('/login')
    .post(authController.loginUser);

// POST /register route for user registration
router.route('/register')
    .post(authController.registerUser);

module.exports = router;