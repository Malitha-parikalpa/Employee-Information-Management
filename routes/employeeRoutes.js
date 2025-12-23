const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const cpUpload = upload.fields([
    { name: 'nic', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'appointmentLetter', maxCount: 1 }
]);

router.get('/', verifyToken, authorizeRoles('admin'), getEmployees);
router.post('/', verifyToken, authorizeRoles('admin'), cpUpload, createEmployee);
router.put('/:id', verifyToken, authorizeRoles('admin'), cpUpload, updateEmployee);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteEmployee);

module.exports = router;
