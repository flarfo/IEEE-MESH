const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const auth = require('../middleware/authMiddleware');

router.route('/debug-test-email')
    .get(usersController.debugTestEmail)

router.route('/users')
    .post(usersController.createNewUser);

router.route('/users/:id/verify/:token')
    .get(usersController.getUserVerificationById);

router.use('/users', verifyJWT);


router.route('/users/:username')
    .get(usersController.getMemberByUsername);

// Routing for Users data HTTP methods
router.route('/users')
    .get(auth.verifyAdmin, usersController.getAllUsers)
    .patch(auth.verifyAdminOrOwner, usersController.updateUser)
    .delete(auth.verifyAdminOrOwner, usersController.deleteUser);

module.exports = router;