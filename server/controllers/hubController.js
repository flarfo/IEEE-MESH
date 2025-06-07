const Hub = require('../models/Hub');
const Profile = require('../models/Profile');

// @desc Get all hubs
// @route GET /hubs
// @access Private
const getAllHubs = async (req, res) => {
    const hubs = await Hub.find().lean();

    if (!hubs?.length) {
        // if no hubs exist, return JSON with bad request message
        return res.status(400).json({ message: 'No hubs found.' });
    }
    // TODO: don't include unnecessary info (like page customizations)

    // return found members
    res.json(hubs);
};

// @desc Get hub by name
// @route GET /hubs/byName/:name
// @access Private
const getHubByName = async (req, res) => {
    const name = req.params.name;

    const hub = await Hub.findOne({ 'name': name });

    if (!hub) {
        return res.status(404).json({ message: `Hub ${name} not found.` });
    }

    return res.json(hub);
};

// @desc Get hub by ID
// @route GET /hubs/:id
// @access Private
const getHubById = async (req, res) => {
    const id = req.params.id;

    const hub = await Hub.findById(id);

    if (!hub) {
        return res.status(404).json({ message: `Hub ${id} not found.` });
    }

    return res.json(hub);
};

// @desc Creates a new hub 
// @route POST /hubs
// @access Private (MESH Admin)
const createNewHub = async (req, res) => {

};

// @desc Updates an existing hub
// @route PATCH /hubs/:id
// @access Private (Hub admin)
const updateHub = async (req, res) => {

};

// @desc Deletes an existing hub
// @route DELETE /hubs/:id
// @access Private (Hub admin)
const deleteHub = async (req, res) => {

};

// @desc Gets profiles of a specific hub
// @route GET /hubs/:id/profiles
// @access Public
const getProfilesByHubId = async (req, res) => {
    // TODO: Change functionality based on access level 
    // - base members can view public profiles
    // - elevated members (webmaster, recruiter) can view all
    const hubId = req.params.id;
    const hub = Hub.findById(hubId);

    const users = Object.keys(hub.users);

    const profiles = Profile.aggregate([
        {
            $match: {
                user: { $in: users }
            }
        }
    ])

    return res.json(profiles);
};

// @desc Gets membership requests of a specific hub
// @route GET /hubs/:id/requests
// @access Private
const getMembershipRequestsByHubId = async (req, res) => {

};

// @desc Verifies a membership request and adds member to the hub
// @route POST /hubs/:id/members
// @access Private
const verifyUserById = async (req, res) => {

};

// @desc Updates a user's roles within a specific hub
// @route PATCH /hubs/:id/members
// @access Private
const updateUserRolesById = async (req, res) => {

};

// @desc Removes a user's access to a specific hub
// @route POST /hubs/:id/members
// @access Private
const removeUserById = async (req, res) => {
    // change
};

// @desc Gets all of a hubs events
// @route GET /hubs/:id/events
// @access Private
const getEventsByHubId = async (req, res) => {

};

// @desc Gets all of a hubs announcements
// @route GET /hubs/:id/announcements
// @access Private
const getAnnouncementsByHubId = async (req, res) => {

};

// @desc Adds a new recruiter to the hub
// @route POST /hubs/:id/recruiters
// @access Private
const addNewRecruiter = async (req, res) => {

};

module.exports = {
    getAllHubs,
    getHubByName,
    getHubById,
    getProfilesByHubId,
};