const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

// Routing for Members data HTTP methods
router.route('/members')
    .get(membersController.getAllMembers) // read
    .post(membersController.createNewMember) // create
    .patch(membersController.updateMember) // update
    .delete(membersController.deleteMember); // delete

module.exports = router;