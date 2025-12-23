const express = require('express');
const router = express.Router();
const {
    getRoles,
    createRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// All role routes are protected. Admin can CRUD.
router.get('/', verifyToken, authorizeRoles('admin'), getRoles);
router.post('/', verifyToken, authorizeRoles('admin'), createRole);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateRole);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteRole);

module.exports = router;
