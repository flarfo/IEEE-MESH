const Member = require('../models/Member');

// TODO: add user linking and member creation

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

    // return found users
    res.json(members);
};

// @desc Create new member
// @route POST /members
// @access Private
const createNewMember = async (req, res) => {
    const { name, email, roles, internships, research } = req.body;

    // Confirm that data is valid
    if (!name || !email) {
        // if missing required information, return JSON with bad request message
        return res.status(400).json({ message: 'Name and email fields are required.' });
    }

    // Check for duplicate information
    const duplicate = await Member.findOne({ email }).lean().exec();

    if (duplicate) {
        // if duplicate, return JSON with conflict message
        return res.status(409).json({ message: 'Duplicate email.' });
    }

    const memberObject = { name, email, roles, internships, research };

    // Create and store the new member
    const member = await Member.create(memberObject);

    if (member) {
        res.status(201).json({ message: `New member ${name} created.` });
    }
    else {
        res.status(400).json({ message: 'Invalid member data received.' });
    }
};

// @desc Update a member
// @route PATCH /members
// @access Private
const updateMember = async (req, res) => {
    const {id, name, email, roles, internships, research } = req.body;
    // TODO: id not obtained by request
    // Confirm that data is valid
    console.log(id);
    if (!id || !name || !email) {
        return res.status(400).json({ message: 'Name and email fields are required.' });
    }

    const member = Member.findById(id).exec();

    if (!member) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const duplicate = await Member.findOne({ email }).lean().exec();

    // Verify that received id equals original id (the existing member we are searching for, not an actual duplicate) 
    if (duplicate && duplicate?._id.toString() !== id) {
        // if duplicate, return JSON with conflict message
        return res.status(409).json({ message: 'Duplicate email.' });
    }

    member.name = name;
    member.email = email;
    member.roles = roles;
    member.internships = internships;
    member.research = research;

    const updatedMember = await member.save();

    res.json({ message: `${updatedMember.name} updated.` });
};

// @desc Delete a member
// @route DELETE /members
// @access Private
const deleteMember = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Member ID required.' })
    }

    const member = await Member.findById(id).exec();

    if (!member) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const result = await user.deleteOne();

    const reply = `Name ${result.name} with ID ${result._id} deleted.`
    res.json(reply);
};

module.exports = {
    getAllMembers,
    createNewMember,
    updateMember,
    deleteMember
};