const Employee = require('../model/employeeModel');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({})
            .populate('department', 'name')
            .populate('job', 'jobTitle')
            .populate('role', 'name');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
    try {
        const { fullName, email, username, password, phone, address, department, job, status } = req.body;

        const employeeExists = await Employee.findOne({ $or: [{ email }, { username }] });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee with this email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const documents = [];
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                documents.push({
                    fieldName: file.fieldname,
                    originalName: file.originalname,
                    path: file.path.replace(/\\/g, '/') // Ensure forward slashes for URLs
                });
            });
        }

        const employee = await Employee.create({
            fullName,
            email,
            username,
            password: hashedPassword,
            phone,
            address,
            department,
            job,
            role: 'user', // Default role for employees
            status,
            documents
        });

        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const { fullName, email, username, password, phone, address, department, job, status } = req.body;

        employee.fullName = fullName || employee.fullName;
        employee.email = email || employee.email;
        employee.username = username || employee.username;
        if (password) {
            employee.password = await bcrypt.hash(password, 10);
        }
        employee.phone = phone || employee.phone;
        employee.address = address || employee.address;
        employee.department = department || employee.department;
        employee.job = job || employee.job;
        employee.status = status || employee.status;

        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                // Update existing document or add new one
                const existingDocIndex = employee.documents.findIndex(doc => doc.fieldName === file.fieldname);
                if (existingDocIndex > -1) {
                    // Optionally delete old file from disk here
                    employee.documents[existingDocIndex] = {
                        fieldName: file.fieldname,
                        originalName: file.originalname,
                        path: file.path.replace(/\\/g, '/')
                    };
                } else {
                    employee.documents.push({
                        fieldName: file.fieldname,
                        originalName: file.originalname,
                        path: file.path.replace(/\\/g, '/')
                    });
                }
            });
        }

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Optionally delete files from disk here
        employee.documents.forEach(doc => {
            if (fs.existsSync(doc.path)) {
                fs.unlinkSync(doc.path);
            }
        });

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
