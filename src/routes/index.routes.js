import { Router } from "express";
import productsRoutes from "./products.routes.js";
import healthRoutes from "./health.routes.js";
import { responseNotFound, responseServerError } from "../helpers/controllers.response.js";

const router = Router();

// Cargamos las rutas de los distintos controladores
router.use("/api/products", productsRoutes);
router.use("/health", healthRoutes);

// Control global del Error 404 - ruta no existe
router.use((req, res) => responseNotFound(res, `La ruta ${req.url} no existe`));

// Control global del Errir 500 - error no controlado
router.use((err, req, res, next) => {
  console.error(err);
  responseServerError(res);
});

export default router;