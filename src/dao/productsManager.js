import fs from 'fs';

class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    // Leer productos desde el archivo JSON
    readProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo los productos:', error);
            return [];
        }
    }

    // Escribir productos en el archivo JSON
    writeProducts(products) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error escribiendo los productos:', error);
        }
    }

    // Agregar un nuevo producto
    addProduct(product) {
        const products = this.readProducts();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product,
        };
        products.push(newProduct);
        this.writeProducts(products);
        return newProduct;
    }

    // Obtener un producto por ID
    getProductById(productId) {
        const products = this.readProducts();
        return products.find(product => product.id === productId) || null;
    }

    // Actualizar un producto por ID
    updateProduct(productId, updatedData) {
        const products = this.readProducts();
        const index = products.findIndex(product => product.id === productId);

        if (index === -1) return null;

        const updatedProduct = { ...products[index], ...updatedData, id: productId };
        products[index] = updatedProduct;
        this.writeProducts(products);

        return updatedProduct;
    }

    // Eliminar un producto por ID
    deleteProduct(productId) {
        const products = this.readProducts();
        const index = products.findIndex(product => product.id === productId);

        if (index === -1) return null;

        const deletedProduct = products.splice(index, 1)[0];
        this.writeProducts(products);

        return deletedProduct;
    }
}

export default ProductsManager;
