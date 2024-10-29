import { Router } from "express";
import fs from 'fs';

const productosPath = './src/data/productos.json';
const readProducts = () => JSON.parse(fs.readFileSync(productosPath, 'utf-8'));
const writeProducts = (products) => fs.writeFileSync(productosPath, JSON.stringify(products, null, 2));

export default function productsRouter(io) {
    const router = Router();

    router.get('/', (req, res) => {
        const products = readProducts();
        const { limit } = req.query;
        if (limit) {
            return res.json(products.slice(0, limit));
        }
        res.json(products);
    });

    router.post('/', (req, res) => {
        const products = readProducts();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock,
            category: req.body.category,
        };
        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        products.push(newProduct);
        writeProducts(products);

        io.emit('updateProducts', newProduct);
        console.log("Evento emitido: updateProducts", newProduct);


        res.status(201).json(newProduct);
    });

    router.put('/:pid', (req, res) => {
        const products = readProducts();
        const productId = parseInt(req.params.pid);

        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }


        const updatedProduct = {
            ...products[productIndex],
            ...req.body
        };

        updatedProduct.id = products[productIndex].id;

        console.log("Producto actualizado:", updatedProduct);

        products[productIndex] = updatedProduct;

        console.log("Productos antes de guardar:", products);
        writeProducts(products);

        res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
    });


    router.delete('/:pid', (req, res) => {
        const products = readProducts();
        const productId = parseInt(req.params.pid);
    
        const productIndex = products.findIndex(p => p.id === productId);
    
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
    
        products.splice(productIndex, 1);
        writeProducts(products);
    
        // Emitir un evento `deleteProduct` con el ID del producto eliminado
        io.emit('deleteProduct', productId);
    
        res.json({ message: 'Producto eliminado con éxito' });
    });
    return router;
}

