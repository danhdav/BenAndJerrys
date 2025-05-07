import express from 'express';
const router = express.Router();
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../controllers/employeesController.js';

router.get('/', getEmployees); // Fetch all employees
router.post('/', addEmployee); // Add a new employee
router.put('/:id', updateEmployee); // Update an employee
router.delete('/:id', deleteEmployee); // Delete an employee

export default router;