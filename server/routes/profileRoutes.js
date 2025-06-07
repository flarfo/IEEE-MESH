const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profilesController');
const verifyJWT = require('../middleware/verifyJWT');
const auth = require('../middleware/authMiddleware');

router.use('/profiles', verifyJWT);

// Routing for Profile data HTTP methods
router.route('/profiles')
    .get(auth.verifySiteAdmin, profilesController.getAllProfiles)
    .patch(auth.verifySiteAdminOrOwner, profilesController.updateProfile)

module.exports = router;