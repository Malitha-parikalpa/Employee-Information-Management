const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true, unique: true },
    category: {
        type: String,
        required: true,
        enum: ['Technical', 'Non-Technical', 'Support'],
        default: 'Technical'
    },
    jobLevel: { type: String, required: true }
},
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
