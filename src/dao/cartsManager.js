import fs from 'fs';

class CartsManager {
    constructor(cartsPath, productsPath) {
        this.cartsPath = cartsPath;
        this.productsPath = productsPath;
    }

    // Leer todos los carritos
    readCarts() {
        try {
            const data = fs.readFileSync(this.cartsPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo los carritos:', error);
            return [];
        }
    }

    // Escribir en el archivo de carritos
    writeCarts(carts) {
        try {
            fs.writeFileSync(this.cartsPath, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Error escribiendo los carritos:', error);
        }
    }

    // Leer productos
    readProducts() {
        try {
            const data = fs.readFileSync(this.productsPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo los productos:', error);
            return [];
        }
    }

    // Crear un nuevo carrito
    createCart() {
        const carts = this.readCarts();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        this.writeCarts(carts);
        return newCart;
    }

    // Obtener un carrito por su ID
    getCartById(cartId) {
        const carts = this.readCarts();
        return carts.find(c => c.id === cartId) || null;
    }

    // Agregar un producto a un carrito
    addProductToCart(cartId, productId) {
        const carts = this.readCarts();
        const products = this.readProducts();

        const cart = carts.find(c => c.id === cartId);
        if (!cart) return { error: 'Carrito no encontrado' };

        const product = products.find(p => p.id === productId);
        if (!product) return { error: 'Producto no encontrado' };

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        this.writeCarts(carts);
        return cart;
    }
}

export default CartsManager;
