const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, departmentController.createDepartment);
router.get('/', verifyToken, departmentController.getDepartments);
router.put('/:id', verifyToken, departmentController.updateDepartment);
router.delete('/:id', verifyToken, departmentController.deleteDepartment);

module.exports = router;
