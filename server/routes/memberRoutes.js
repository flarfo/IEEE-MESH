const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');
const verifyJWT = require('../middleware/verifyJWT');
const auth = require('../middleware/authMiddleware');

router.use('/members', verifyJWT);

// Routing for Members data HTTP methods
router.route('/members')
    .get(auth.verifyAdmin, membersController.getAllMembers)
    .patch(auth.verifyAdminOrOwner, membersController.updateMember)
    .delete(auth.verifyAdminOrOwner, membersController.deleteMember);

module.exports = router;