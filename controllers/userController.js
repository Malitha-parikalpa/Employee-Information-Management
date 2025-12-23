const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

// Create user - admin only
const createUser = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role || 'admin',
        permissions: req.body.permissions || []
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// Get all users - admin only
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single user - admin or self
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Allow admin or self to view
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user (assign department/jobTitle) - admin only
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update username if provided
        if (req.body.username) {
            user.username = req.body.username;
        }

        // Update role if provided
        if (req.body.role) {
            user.role = req.body.role;
        }

        // Update permissions if provided
        if (req.body.permissions) {
            user.permissions = req.body.permissions;
        }

        // Update password if provided (hash it first)
        if (req.body.password && req.body.password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        // Return user without password
        const userResponse = {
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role
        };

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user - admin only
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};