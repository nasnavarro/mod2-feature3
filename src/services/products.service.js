import products from '../db/products.js';

//Función que a partir de los productos obtiene el máximo id de los productos, para devolver el siguiente.
const getNextId = () => {
  const maxId = products.reduce((max, p) => Math.max(max, Number(p.id)), 0);
  return maxId + 1;
};

//Obtiene todos los productos.
export const getAllProducts = async () => products;

//Obtiene un producto a partir de su id.
export const getProductById = async (id) =>
  products.find((p) => p.id === Number(id)) ?? null;

//Crea un producto.
export const createProduct = async (data) => {
  const newProduct = {
    id: getNextId(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  return newProduct;
};

//Actualiza un producto.
export const updateProduct = async (id, data) => {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  // Añadimos al final de nuevo ", id: products[index].id" por lo siguiente: Si el
  // cliente enviase id en el body del PUT, ...data lo sobreescribiría. Al
  // ponerlo al final se garantiza que el id original nunca puede ser modificado, independientemente de lo que venga en el body.
  products[index] = { ...products[index], ...data, id: products[index].id };
  return products[index];
};

//Elimina un producto a partir de su id.
export const deleteProduct = async (id) => {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  const [deleted] = products.splice(index, 1);
  return deleted;
};
