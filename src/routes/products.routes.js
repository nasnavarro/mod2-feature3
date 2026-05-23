import { Router } from "express";
import * as productsController from "../controllers/products.controller.js";

const router = Router();

// Gestiona las rutas de productos, que tienen estructura previa definida en
// index.routes: /api/products

// Getters
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
// Post
router.post('/', productsController.createProduct);
// Put
router.put('/:id', productsController.updateProduct);
// Delete
router.delete('/:id', productsController.deleteProduct);

export default router;