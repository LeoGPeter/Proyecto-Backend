import express from 'express';
import fs from 'fs';

const router = express.Router();

const productosPath = './src/data/productos.json';

const readProducts = () => JSON.parse(fs.readFileSync(productosPath, 'utf-8'));

router.get('/home', (req, res) => {
    const products = readProducts;
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    const products = readProducts; 
    res.render('realTimeProducts', { products });
});

export default router;
