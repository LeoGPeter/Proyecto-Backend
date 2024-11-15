// src/routes/productsRouter.js
import { Router } from 'express';
import { ProductManagerMongo } from '../dao/mongoManagers/productManagerMongo.js';
import ProductsManager from '../dao/productsManager.js';

export default function productsRouter(io) {
  const router = Router();
  const useMongoDB = "mongodb+srv://leopeter98:Peter75745@cluster0.vrd1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const productsManager = useMongoDB ? new ProductManagerMongo() : new ProductsManager('./src/data/productos.json');

  router.get('/', async (req, res) => {
    try {
      const products = await productsManager.getAll();
      const { limit } = req.query;
      if (limit) {
        return res.json(products.slice(0, limit));
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
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


