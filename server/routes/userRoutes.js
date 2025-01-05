const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/users')
    .post(usersController.createNewUser);

router.route('/users/:id/verify/:token')
    .get(usersController.getUserVerificationById);

router.use('/users', verifyJWT);

// Routing for Users data HTTP methods
router.route('/users')
    .get(usersController.getAllUsers)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser);

module.exports = router;