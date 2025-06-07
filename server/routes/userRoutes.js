const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const auth = require('../middleware/authMiddleware');

router.route('/users/register')
    .post(usersController.registerUser);

router.route('/users/:id/verify/:token')
    .get(usersController.getUserVerificationById);

router.use('/users', verifyJWT);

router.route('/users/:username')
    .get(usersController.getMemberByUsername);

// Routing for Users data HTTP methods
router.route('/users')
    .get(auth.verifySiteAdmin, usersController.getAllUsers)
    .patch(auth.verifySiteAdminOrOwner, usersController.updateUser)
    .delete(auth.verifySiteAdminOrOwner, usersController.deleteUser);

module.exports = router;