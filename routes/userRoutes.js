const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const authorizationRoles = require('../middlewares/roleMiddleware');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Get all users - admin only
router.get('/', verifyToken, authorizationRoles('admin'), getUsers);

// Get single user - admin or self
router.get('/:id', verifyToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
}, getUser);

// Create user - admin only
router.post('/', verifyToken, authorizationRoles('admin'), createUser);

// Update user - admin only
router.put('/:id', verifyToken, authorizationRoles('admin'), updateUser);

// Delete user - admin only
router.delete('/:id', verifyToken, authorizationRoles('admin'), deleteUser);

//only admin can access these routes
router.get("/admin", verifyToken,
    authorizationRoles("admin"),
    (req, res) => {
        res.json({ message: "welcome Admin" });
    });

//both admin and manager can access these routes
router.get("/manager", verifyToken, authorizationRoles("admin", "manager"), (req, res) => {
    res.json({ message: "welcome Manager" });
});
//All authenticated users can access these routes
router.get("/user", verifyToken, authorizationRoles("admin", "manager", "user"), (req, res) => {
    res.json({ message: "welcome User" });
});


module.exports = router;