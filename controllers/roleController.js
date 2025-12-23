const Role = require('../model/roleModel');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a role
// @route   POST /api/roles
// @access  Private/Admin
const createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        const roleExists = await Role.findOne({ name });

        if (roleExists) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        const role = await Role.create({ name, description, permissions });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private/Admin
const updateRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        role.name = req.body.name || role.name;
        role.description = req.body.description || role.description;
        role.permissions = req.body.permissions || role.permissions;

        const updatedRole = await role.save();
        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: 'Role removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole
};
