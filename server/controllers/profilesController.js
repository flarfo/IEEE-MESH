const Profile = require('../models/Profile');
const User = require('../models/User');

// HTTP controller methods for Profiles data (Routing found in routes/profileRoutes)

// @desc Get all profiles
// @route GET /profiles
// @access Private
const getAllProfiles = async (req, res) => {
    // select() to choose which elements to take, for example select('-password') will exclude the password
    // lean() to get data as JSON without extra method information
    const profiles = await Profile.find().lean();

    if (!profiles?.length) {
        // if no profiles exist, return JSON with bad request message
        return res.status(400).json({ message: 'No profiles found.' });
    }

    // return found profiles
    res.json(profiles);
};

// @desc Update a profile
// @route PATCH /profiles/:id
// @access Private
const updateProfile = async (req, res) => {
    try {
        const { id, username, name, email, internships, research } = req.body;

        // User existence is already verified in the middleware
        let profile = await Profile.findOne({ user: id });

        // If no profile exists in the user profile, create a new one
        if (!profile) {
            const profileObject = { name, email, internships, research };
            const newProfile = await Profile.create(profileObject);

            return res.json({ message: `${newProfile.name} updated.` });
        }

        // Update existing profile
        profile.name = name;
        profile.email = email;
        profile.internships = internships;
        profile.research = research;

        const updatedProfile = await profile.save();

        return res.json({ message: `${updatedProfile.name} updated.` });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProfiles,
    updateProfile,
};