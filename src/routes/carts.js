import { Router } from 'express';
import CartsManager from '../dao/cartsManager.js';

const router = Router();
const cartsManager = new CartsManager('./src/data/carrito.json', './src/data/productos.json');

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = cartsManager.createCart();
  res.status(201).json(newCart);
});

// Obtener un carrito por ID
router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartsManager.getCartById(cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart);
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const result = cartsManager.addProductToCart(cartId, productId);

    if (result.error) {
        return res.status(404).json({ error: result.error });
    }

    res.status(200).json({ message: 'Producto agregado al carrito', cart: result });
});

export default router;