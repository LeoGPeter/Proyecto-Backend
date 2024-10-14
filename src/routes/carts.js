import { Router } from 'express';
import fs from 'fs';

const router = Router();
const cartsPath = './src/data/carrito.json';
const productosPath = './src/data/productos.json';

const readCarts = () => JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
const writeCarts = (carts) => fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));

const readProducts = () => JSON.parse(fs.readFileSync(productosPath, 'utf-8'));

router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
    products: []
  };

  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cartId = parseInt(req.params.cid);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const products = readProducts();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    // Verificar si el carrito existe
    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Verificar si el producto existe
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
        // Si ya existe, incrementar la cantidad
        existingProduct.quantity += 1;
    } else {
        // Si no existe, agregar el producto con cantidad 1
        cart.products.push({ product: productId, quantity: 1 });
    }

    writeCarts(carts); // Guarda los cambios en el archivo

    res.status(200).json({ message: 'Producto agregado al carrito', cart });
});



export default router;
