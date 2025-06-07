const Member = require('../models/Member');
const User = require('../models/User');

// HTTP controller methods for Members data (Routing found in routes/memberRoutes)

// @desc Get all members
// @route GET /members
// @access Private
const getAllMembers = async (req, res) => {
    // select() to choose which elements to take, for example select('-password') will exclude the password
    // lean() to get data as JSON without extra method information
    const members = await Member.find().lean();

    if (!members?.length) {
        // if no members exist, return JSON with bad request message
        return res.status(400).json({ message: 'No members found.' });
    }

    // return found members
    res.json(members);
};

// @desc Update a member
// @route PATCH /members
// @access Private
const updateMember = async (req, res) => {
    try {
        const { id, username, name, email, internships, research } = req.body;

        // User existence is already verified in the middleware
        const user = await User.findById(id);
        let member = await Member.findById(user.member);

        // If no member exists in the user profile, create a new one
        if (!member) {
            const memberObject = { name, email, internships, research };
            const newMember = await Member.create(memberObject);
            user.member = newMember._id;
            await user.save();

            return res.json({ message: `${newMember.name} updated.` });
        }

        // Update existing member
        member.name = name;
        member.email = email;
        member.internships = internships;
        member.research = research;

        const updatedMember = await member.save();

        return res.json({ message: `${updatedMember.name} updated.` });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc Delete a member
// @route DELETE /members
// @access Private
const deleteMember = async (req, res) => {
    const { id } = req.body;
    // Confirm that data is valid
    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const member = Member.findById(user.member);
    // If no member exists in the user profile, create a new one and update
    if (!member) {
        return res.status(400).json({ message: 'Member not found.' });
    }

    // Delete member
    const result = await member.deleteOne();
    const reply = `Name ${result.name} with ID ${result._id} deleted.`
    res.json(reply);

    return res.status(400).json({ message: 'Unauthorized.' });
};

module.exports = {
    getAllMembers,
    updateMember,
    deleteMember
};