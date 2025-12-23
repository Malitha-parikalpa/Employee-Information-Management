const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    fieldName: { type: String, required: true }, // e.g., 'nic', 'certificate', 'appointmentLetter'
    originalName: { type: String, required: true },
    path: { type: String, required: true }
});

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: String,
        required: true,
        enum: ['Intern', 'Probation', 'Permanent', 'Resigned', 'Suspended'],
        default: 'Intern'
    },
    documents: [documentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
