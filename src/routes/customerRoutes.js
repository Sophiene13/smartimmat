import express from 'express';
import { createCustomer, getCustomers, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/', protect, createCustomer);       
router.get('/', protect, getCustomers);          
router.put('/:id', protect, updateCustomer);  
router.delete('/:id', protect, deleteCustomer);  

export default router;