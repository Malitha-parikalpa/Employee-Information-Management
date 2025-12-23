const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// All job routes are protected. Admin can CRUD, users can only VIEW.
router.post('/', verifyToken, authorizeRoles('admin'), jobController.createJob);
router.get('/', verifyToken, jobController.getJobs);
router.get('/:id', verifyToken, jobController.getJob);
router.put('/:id', verifyToken, authorizeRoles('admin'), jobController.updateJob);
router.delete('/:id', verifyToken, authorizeRoles('admin'), jobController.deleteJob);

module.exports = router;
