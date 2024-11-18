import { Router } from 'express';
import { ProductManagerMongo } from '../dao/mongoManagers/productManagerMongo.js';
import ProductsManager from '../dao/productsManager.js';
import ProductModel from '../dao/models/product.model.js';

export default function productsRouter(io) {
  const router = Router();
  const useMongoDB = "mongodb+srv://leopeter98:Peter75745@cluster0.vrd1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const productsManager = useMongoDB ? new ProductManagerMongo() : new ProductsManager('./src/data/productos.json');

  router.get('/', async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
      };

      const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

      const products = await ProductModel.paginate(filter, options);

      res.status(200).json({
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.hasPrevPage ? products.page - 1 : null,
        nextPage: products.hasNextPage ? products.page + 1 : null,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.page - 1}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.page + 1}` : null,
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
  });


  router.get('/:pid', async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productsManager.getById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const newProduct = await productsManager.create(req.body);
      io.emit('updateProducts', newProduct);
      console.log('Evento emitido: updateProducts', newProduct);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el producto' });
    }
  });

  router.put('/:pid', async (req, res) => {
    try {
      const productId = req.params.pid;
      const updatedProduct = await productsManager.update(productId, req.body);

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });

  router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
      const deletedProduct = await productsManager.delete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      io.emit('deleteProduct', productId);
      console.log(`Producto con ID ${productId} eliminado y evento emitido`);

      res.json({ message: 'Producto eliminado con éxito', product: deletedProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  });



  return router;
}


