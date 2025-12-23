require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const autRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const roleRoutes = require('./routes/roleRoutes');
const path = require('path');


const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow both localhost and IP
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
app.use('/api/auth', autRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/roles', roleRoutes);

//start server

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});