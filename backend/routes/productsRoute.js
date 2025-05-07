import express from 'express';
const router = express.Router();
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';

router.get('/', getProducts); // Fetch all products
router.post('/', addProduct); // Add a new product
router.put('/:id', updateProduct); // Update a product
router.delete('/:id', deleteProduct); // Delete a product

export default router;