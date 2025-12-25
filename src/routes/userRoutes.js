import express from 'express';
import { createEmployee,deleteEmployee, getEmployees, updateEmployee } from '../controllers/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/employees', protect, adminOnly, createEmployee);
router.get('/employees', protect, adminOnly, getEmployees);
router.put('/employees/:id', protect, adminOnly, updateEmployee);
router.delete('/employees/:id', protect, adminOnly, deleteEmployee);

export default router;