const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');
const verifyJWT = require('../middleware/verifyJWT');
const auth = require('../middleware/authMiddleware');

router.use('/hubs', verifyJWT);

// Routing for Hub data HTTP methods
router.route('/hubs')
    .get(hubController.getHubs);

router.route('/hubs/:id')
    .get(hubController.getHubById);

router.route('/hubs/byName/:name')
    .get(hubController.getHubByName);

module.exports = router;