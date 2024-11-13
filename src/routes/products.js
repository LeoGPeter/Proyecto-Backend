import { Router } from "express";
import ProductsManager from '../dao/productsManager.js';

export default function productsRouter(io) {
    const router = Router();
const productsManager = new ProductsManager('./src/data/productos.json');

    // Obtener todos los productos
router.get('/', (req, res) => {
    const products = productsManager.readProducts();
    const { limit } = req.query;
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productsManager.getProductById(productId);

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const newProduct = productsManager.addProduct(req.body);

    io.emit('updateProducts', newProduct);
        console.log("Evento emitido: updateProducts", newProduct);

    res.status(201).json(newProduct);
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = productsManager.updateProduct(productId, req.body);

    if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const deletedProduct = productsManager.deleteProduct(productId);

    if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    io.emit('deleteProduct', productId);
    
    res.json({ message: 'Producto eliminado con éxito', product: deletedProduct });
});
    return router;
}

