import express from 'express';
const router = express.Router();
import { getOrders , addOrder, updateOrder, deleteOrder } from '../controllers/ordersController.js';

router.get('/', getOrders); // Fetch all employees
router.post('/', addOrder); // Add a new employee
router.put('/:id', updateOrder); // Update an employee
router.delete('/:id', deleteOrder); // Delete an employee

export default router;