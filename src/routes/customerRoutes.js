import express from 'express';
import { createCustomer, getCustomers, deleteCustomer } from '../controllers/customerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/', protect, createCustomer);       
router.get('/', protect, getCustomers);          
router.delete('/:id', protect, deleteCustomer);  

export default router;