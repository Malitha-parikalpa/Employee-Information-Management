const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [{ type: String }] // e.g., 'MANAGE_EMPLOYEES', 'MANAGE_DEPARTMENTS', 'VIEW_REPORTS'
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
