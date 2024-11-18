import { Router } from 'express';
import { CartModel } from '../dao/models/cart.model.js';
import  ProductModel  from '../dao/models/product.model.js';
import mongoose from 'mongoose';

const router = Router();

//Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartModel.create({ products: [] });
        res.status(201).json({ status: 'success', message: 'Carrito creado', cart: newCart });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito' });
    }
});


// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).send('ID de carrito inválido');
        }

        const cart = await CartModel.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al cargar el carrito');
    }
});


router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send('El ID del carrito o producto no es válido');
        }

        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }

        await cart.save();

        res.status(201).json({ status: 'success', message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito' });
    }
});


//Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(item => item.product.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
    }
});

//Actualizar todo el carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Carrito actualizado', cart });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar carrito' });
    }
});

//Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.json({ status: 'success', message: 'Cantidad actualizada', cart });
    } catch (error) {
        console.error('Error al actualizar cantidad de producto:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar cantidad' });
    }
});

//Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Carrito vaciado', cart });
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al vaciar carrito' });
    }
});

export default router;
