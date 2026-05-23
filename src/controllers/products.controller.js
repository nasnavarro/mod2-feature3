import * as productsService from '../services/products.service.js';
import { responseOk, responseCreated, responseNotFound, responseBadRequest, responseServerError } from '../helpers/controllers.response.js';

// Valida los campos obligatorios del body en POST y PUT. Devuelve array de errores.
// Validaciones: "name" obligatorio, "price obligatorio" y price => 0.
const validateProductBody = ({ name, price }) => {
  const errors = [];
  if (!name || typeof name !== 'string') errors.push('El nombre (name) es obligatorio y debe ser un texto');
  if (price === undefined || price === null) errors.push('El precio (price) es obligatorio');
  else if (typeof price !== 'number' || price < 0) errors.push('El precio (price) debe ser un número mayor o igual a 0');
  return errors;
};

// Obtiene todos los productos (GET /api/products)
export const getProducts = async (req, res) => {
  try {
    responseOk(res, await productsService.getAllProducts());
  } catch (err) {
    responseServerError(res, err);
  }
};

// Obtiene un producto por id (GET /api/products/:id)
export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return responseBadRequest(res, `El id proporcionado (${req.params.id}) no es válido`);

    const product = await productsService.getProductById(id);
    if (!product) return responseNotFound(res, `No existe ningún producto con id ${id}`);

    responseOk(res, product);
  } catch (err) {
    responseServerError(res, err);
  }
};

// Crea un producto (POST /api/products)
// Validaciones: "name" obligatorio, "price obligatorio" y price => 0.
export const createProduct = async (req, res) => {
  try {
    const errors = validateProductBody(req.body);
    if (errors.length) return responseBadRequest(res, 'Datos inválidos', errors);

    const newProduct = await productsService.createProduct(req.body);
    responseCreated(res, newProduct);
  } catch (err) {
    responseServerError(res, err);
  }
};

// Actualiza un producto (PUT /api/products/:id)
// Validaciones: "name" obligatorio, "price obligatorio" y price => 0.
export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return responseBadRequest(res, `El id proporcionado (${req.params.id}) no es válido`);

    const errors = validateProductBody(req.body);
    if (errors.length) return responseBadRequest(res, 'Datos inválidos', errors);

    const product = await productsService.updateProduct(id, req.body);
    if (!product) return responseNotFound(res, `No existe ningún producto con id ${id}`);

    responseOk(res, product);
  } catch (err) {
    responseServerError(res, err);
  }
};

// Elimina un producto (DELETE /api/products/:id)
export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return responseBadRequest(res, `El id proporcionado (${req.params.id}) no es válido`);

    const product = await productsService.deleteProduct(id);
    if (!product) return responseNotFound(res, `No existe ningún producto con id ${id}`);

    responseOk(res, product);
  } catch (err) {
    responseServerError(res, err);
  }
};
