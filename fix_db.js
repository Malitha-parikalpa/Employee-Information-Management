require('dotenv').config();
const mongoose = require('mongoose');

const fix = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const jobsCollectionExists = collections.some(col => col.name === 'jobs');

        if (jobsCollectionExists) {
            console.log('Dropping jobs collection to clear old schema and indexes...');
            await mongoose.connection.db.dropCollection('jobs');
            console.log('Collection dropped successfully.');
        } else {
            console.log('Jobs collection does not exist.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

fix();
