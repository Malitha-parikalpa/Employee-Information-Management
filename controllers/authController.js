const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const Employee = require('../model/employeeModel');
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Registration error:', error);

        // Handle duplicate username error
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        let isAdmin = false;
        let user = await User.findOne({ username });
        if (user) {
            isAdmin = true;
        } else {
            user = await Employee.findOne({ username });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            isAdmin: isAdmin,
            permissions: user.permissions || []
        },
            process.env.JWT_SECRET,
            { expiresIn: '24h' });

        res.status(200).json({ token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };