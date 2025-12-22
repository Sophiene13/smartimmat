import express from 'express';
import { createEmployee } from '../controllers/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/employees', protect, adminOnly, createEmployee);

export default router;