const Job = require('../model/jobModel');

// Create a new job
exports.createJob = async (req, res) => {
    try {
        const { jobTitle, category, jobLevel } = req.body;

        const existingJob = await Job.findOne({ jobTitle });
        if (existingJob) {
            return res.status(400).json({ message: 'Job title already exists' });
        }

        const job = new Job({
            jobTitle,
            category,
            jobLevel
        });

        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error: error.message });
    }
};

// Get all jobs
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
};

// Get a single job
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
};

// Update a job
exports.updateJob = async (req, res) => {
    try {
        const { jobTitle, category, jobLevel } = req.body;

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.jobTitle = jobTitle || job.jobTitle;
        job.category = category || job.category;
        job.jobLevel = jobLevel || job.jobLevel;

        await job.save();
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error: error.message });
    }
};
