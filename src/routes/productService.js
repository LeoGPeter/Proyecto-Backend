import { ProductManagerMongo } from '../dao/mongoManagers/productManagerMongo.js';
import ProductsManager from '../dao/productsManager.js';

const useMongoDB = "mongodb+srv://leopeter98:Peter75745@cluster0.vrd1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const productManager = useMongoDB ? new ProductManagerMongo() : new ProductsManager();

export const getAllProducts = async () => {
  try {
    return await productManager.getAll();
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    return await productManager.getById(id);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error.message);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    return await productManager.create(productData);
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    return await productManager.update(id, productData);
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await productManager.delete(id);
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    throw error;
  }
};
