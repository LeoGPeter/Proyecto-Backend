import express from 'express';
import fs from 'fs';
import ProductModel from '../dao/models/product.model.js';
import { CartModel } from '../dao/models/cart.model.js';

const router = express.Router();

const productosPath = './src/data/productos.json';

const readProducts = () => JSON.parse(fs.readFileSync(productosPath, 'utf-8'));

router.get('/home', (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await ProductModel.find().lean();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al cargar los productos en tiempo real');
    }
});


router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };

        let filter = {};
        if (query) {
            if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
                filter.status = query.toLowerCase() === 'true';
            } else {
                filter.category = query;
            }
        }

        const products = await ProductModel.paginate(filter, options);

        res.render('index', {
            products: products.docs,
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
        res.status(500).send('Error al cargar la vista de productos');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        res.render('productDetail', { product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al cargar la vista del producto');
    }
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al cargar el carrito');
    }
});


export default router;
